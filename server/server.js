import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import shareasale from "../functions";
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const fetch = require("node-fetch");

const server = new Koa();
const router = new Router();

router.post("/api/shareasalepostback/", koaBody(), async (ctx) => {
  ctx.status = 200;
  if (ctx.request.header["user-agent"] === "ShareASale Postback Agent") {
    const { commission, userID, tracking } = ctx.request.body,
      merchantID = ctx.request.query.merchantID;
    if (merchantID) {
      const account = await shareasale.getAccountByMerchantID(merchantID);
      shareasale.addTagsToOrder(
        account.shop,
        tracking,
        account.accessToken,
        userID,
        commission
      );
    }
  }
});
router.post("/api/editshop/", koaBody(), async (ctx) => {
  ctx.status = 200;
  let requestBody = JSON.parse(ctx.request.body);
  shareasale.editShop(requestBody);
});
// This endpoint is called to validate a merchant's API credentials
router.post("/api/validate/", koaBody(), async (ctx) => {
  ctx.status = 200;
  let requestBody = JSON.parse(ctx.request.body),
    { shop, apiToken, apiSecret, preCheck } = requestBody,
    fakeOrder = {
      name: "#01",
      created_at: "01/01/2000",
    },
    shareasaleAccount = await shareasale.getAccountByShop(shop),
    response = preCheck
      ? await shareasale.voidOrder(
          fakeOrder,
          shareasaleAccount.merchantID,
          shareasaleAccount.shareasaleAPIToken,
          shareasaleAccount.shareasaleAPISecret
        )
      : await shareasale.voidOrder(
          fakeOrder,
          shareasaleAccount.merchantID,
          apiToken,
          apiSecret
        );
  ctx.body = response;
});
router.post("/api/settings/", koaBody(), async (ctx) => {
  ctx.status = 200;
  let requestBody = JSON.parse(ctx.request.body);
  // Only extract settings here and not actual tokens, keys, etc.
  const {
    merchantID,
    masterTagID,
    masterTagShopifyID,
    trackingTagShopifyID,
    recurringCommissionsWebhookID,
    autoReconciliationWebhookID,
    storesConnectStoreID,
    xtypeMode,
    xtypeValue,
    channelDeduplication,
  } = await shareasale.getAccountByShop(requestBody.shop);
  ctx.body = {
    merchantID: merchantID,
    masterTagID: masterTagID,
    masterTagShopifyID: masterTagShopifyID,
    trackingTagShopifyID: trackingTagShopifyID,
    recurringCommissionsWebhookID: recurringCommissionsWebhookID,
    autoReconciliationWebhookID: autoReconciliationWebhookID,
    storesConnectStoreID: storesConnectStoreID,
    xtypeMode: xtypeMode,
    xtypeValue: xtypeValue,
    channelDeduplication: channelDeduplication,
  };
});

router.post("/api/order/", koaBody(), async (ctx) => {
  let trackingTagRequestBody = JSON.parse(ctx.request.body),
    orderID = trackingTagRequestBody.order_id,
    shop = trackingTagRequestBody.shop,
    shareasaleAccount = await shareasale.getAccountByShop(shop);
  const shopifyResponse = await shareasale.getOrder(
    shop,
    orderID,
    shareasaleAccount.accessToken
  );
  ctx.status = 200;
  ctx.body = shopifyResponse;
});
router.post("/api/webhooks/", koaBody(), async (ctx) => {
  ctx.status = 200;
  var shopHeader = "x-shopify-shop-domain",
    webhookHashHeader = "x-shopify-hmac-sha256",
    webhookHeaders = ctx.request.header,
    webhookTopic = webhookHeaders["x-shopify-topic"],
    webhookShop = webhookHeaders["x-shopify-shop-domain"];

  if (webhookTopic === "orders/updated") {
    // Run the VOID API call for any fully refunded order
    // Otherwise, run the EDIT call for any partial refunds
    const shareasaleAccount = await shareasale.getAccountByShop(webhookShop),
      {
        merchantID,
        shareasaleAPIToken,
        shareasaleAPISecret,
      } = shareasaleAccount;
    try {
      if (ctx.request.body.financial_status === "refunded") {
        shareasale.voidOrder(
          ctx.request.body,
          merchantID,
          shareasaleAPIToken,
          shareasaleAPISecret
        );
      } else if (ctx.request.body.financial_status === "partially_refunded") {
        shareasale.editOrder(
          ctx.request.body,
          merchantID,
          shareasaleAPIToken,
          shareasaleAPISecret
        );
      }
    } catch (e) {
      console.log(`Edit/Void Call Failed for ${webhookShop}: ${e}`);
    }
  }
  if (webhookTopic === "app/uninstalled") {
    shareasale.deleteAccountByShop(webhookShop);
  }
  // For recurring commissions
  if (webhookTopic === "orders/create") {
    console.log("it was a create");
    const newOrder = ctx.request.body;
    if (newOrder.source_name === "subscription_contract") {
      // We need to find the origin order, which would have been a web checkout
      // that contained the same SKUs as the new order
      var subscriptionSkulist = [];
      for (let x of newOrder.line_items) {
        subscriptionSkulist.push(x.sku);
      }
      const shareasaleAccount = await shareasale.getAccountByShop(webhookShop),
        {
          merchantID,
          shareasaleAPIToken,
          shareasaleAPISecret,
        } = shareasaleAccount,
        originTransaction = await shareasale.getSubscriptionOrigin(
          webhookShop,
          newOrder.customer.id,
          subscriptionSkulist,
          shareasaleAccount.accessToken
        );
      if (originTransaction) {
        console.log(originTransaction);
        shareasale.referenceTransaction(
          originTransaction.orderNumber,
          originTransaction.createdAt,
          newOrder.subtotal_price,
          newOrder.name,
          merchantID,
          shareasaleAPIToken,
          shareasaleAPISecret
        );
      } else {
        console.log("Failed ref transaction");
      }
    }
  }
});

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;
app.prepare().then(() => {
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken } = ctx.state.shopify;
        shareasale.addShop(shop, accessToken);
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );
  router.get("(.*)", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(cors());
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
