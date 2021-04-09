/**
 * Add a newly installed merchant to MongoDB
 * @param {string} shopifyShop Shop from Oauth: example.myshopify.com
 * @param {string} shopifyAccessToken Access token for interacting with Shopify's REST API
 */
async function addShop(shopifyShop, shopifyAccessToken) {
  const MongoClient = require("mongodb").MongoClient;
  const mongoUri =
    "mongodb+srv://shareasale-shopify-app:n9qJzMhAROBRKfBC@shareasale.a8jed.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("shareasale-shopify-app");
    const accounts = database.collection("accounts");
    // create a document to be inserted
    const doc = {
      shop: shopifyShop,
      accessToken: shopifyAccessToken,
      merchantID: null,
      masterTagID: 19038,
      shareasaleAPIToken: null,
      shareasaleAPISecret: null,
      shareasaleFTPUsername: null,
      shareasaleFTPPassword: null,
      advancedAnalytics: false,
      recurringCommissionsWebhookID: null,
      autoReconciliationWebhookID: null,
      storesConnect: false,
      storesConnectStoreID: null,
      xtypeMode: null,
      dynamicXtypeValue: null,
      staticXtypeValue: null,
      channelDeduplication: false,
    };
    const result = await accounts.insertOne(doc);
    console.log(
      `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`
    );
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}
export default addShop;
