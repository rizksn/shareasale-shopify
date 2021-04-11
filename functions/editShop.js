/**
 * Edits a merchant's listing in MongoDB
 * @param {object} input all variables should be passed as an object with the below properties:
 * @param {string} input.shop The myshopify domain
 * @param {string} input.merchantID ShareASale merchant ID
 * @param {string} input.masterTagID Awin Master Tag ID
 * @param {string} input.apiToken ShareASale API Token
 * @param {string} input.apiSecret ShareASale API Secret Key
 * @param {string} input.shareasaleFTPUsername Username for ShareASale FTP
 * @param {string} input.shareasaleFTPPassword Password for ShareASale FTP
 * @param {boolean} input.advancedAnalytics Advanced Analytics package enabled?
 * @param {boolean} input.recurringCommissions Recurring commissions enabled?
 * @param {boolean} input.autoReconciliation Auto reconciliation enabled?
 * @param {boolean} input.storesConnect StoresConnect enabled?
 * @param {number} input.storesConnectStoreID Store ID for StoresConnect
 * @param {string} input.xtypeMode Enter 'static' or 'dynamic'
 * @param {string} input.xtypeValue Value for static xtype
 * @param {boolean} input.channelDeduplication Whether or not to dedupe by channel
 */
async function editShop(input) {
  const MongoClient = require("mongodb").MongoClient;
  const mongoUri = process.env.ATLAS_URI;
  const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("shareasale-shopify-app");
    const accounts = database.collection("accounts");
    // create a filter for a merchant to update
    const filter = { shop: input.shop };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true, ignoreUndefined: true };
    // create a document that sets the merchant ID
    var updateDoc = {
      $set: {},
    };
    if (input.merchantID) {
      updateDoc.$set = {
        ...updateDoc.$set,
        merchantID: parseInt(input.merchantID),
      };
    }
    if (input.masterTagID) {
      updateDoc.$set = {
        ...updateDoc.$set,
        masterTagID: parseInt(input.masterTagID),
      };
    }
    if (input.masterTagShopifyID) {
      updateDoc.$set = {
        ...updateDoc.$set,
        masterTagShopifyID: input.masterTagShopifyID,
      };
    }
    if (input.trackingTagShopifyID) {
      updateDoc.$set = {
        ...updateDoc.$set,
        trackingTagShopifyID: input.trackingTagShopifyID,
      };
    }
    if (input.shareasaleAPIToken) {
      updateDoc.$set = {
        ...updateDoc.$set,
        shareasaleAPIToken: input.shareasaleAPIToken,
      };
    }
    if (input.shareasaleAPISecret) {
      updateDoc.$set = {
        ...updateDoc.$set,
        shareasaleAPISecret: input.shareasaleAPISecret,
      };
    }
    if (input.shareasaleFTPUsername) {
      updateDoc.$set = {
        ...updateDoc.$set,
        shareasaleFTPUsername: input.shareasaleFTPUsername,
      };
    }
    if (input.shareasaleFTPPassword) {
      updateDoc.$set = {
        ...updateDoc.$set,
        shareasaleFTPPassword: input.shareasaleFTPPassword,
      };
    }
    if (input.advancedAnalytics) {
      updateDoc.$set = {
        ...updateDoc.$set,
        advancedAnalytics: input.advancedAnalytics,
      };
    }
    if (input.recurringCommissionsWebhookID) {
      if (input.recurringCommissionsWebhookID === "delete") {
        input.recurringCommissionsWebhookID = null;
      }
      updateDoc.$set = {
        ...updateDoc.$set,
        recurringCommissionsWebhookID: input.recurringCommissionsWebhookID,
      };
    }
    if (input.autoReconciliationWebhookID) {
      if (input.autoReconciliationWebhookID === "delete") {
        input.autoReconciliationWebhookID = null;
      }
      updateDoc.$set = {
        ...updateDoc.$set,
        autoReconciliationWebhookID: input.autoReconciliationWebhookID,
      };
    }
    if (input.storesConnectStoreID) {
      updateDoc.$set = {
        ...updateDoc.$set,
        storesConnectStoreID: input.storesConnectStoreID,
      };
    }
    if (input.xtypeMode) {
      updateDoc.$set = { ...updateDoc.$set, xtypeMode: input.xtypeMode };
    }
    if (input.xtypeValue) {
      updateDoc.$set = {
        ...updateDoc.$set,
        xtypeValue: input.xtypeValue,
      };
    }
    if (input.channelDeduplication) {
      updateDoc.$set = {
        ...updateDoc.$set,
        channelDeduplication: input.channelDeduplication,
      };
    }
    const result = await accounts.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    await client.close();
  }
}

export default editShop;
