/**
 * Add a newly installed merchant to MongoDB
 * @param {string} shopifyShop Shop from Oauth: example.myshopify.com
 * @param {string} shopifyAccessToken Access token for interacting with Shopify's REST API
 */
async function addShop(shopifyShop, shopifyAccessToken) {
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
    // create a document to be inserted
    const doc = {
      shop: shopifyShop,
      accessToken: shopifyAccessToken,
      merchantID: 44911,
      masterTagID: 19038,
      shareasaleAPIToken: "UHf2ge6r1FViev0n",
      shareasaleAPISecret: "SGs3ec1z7ZJile1eKSk3vb0j1JHpdo0v",
      shareasaleFTPUsername: null,
      shareasaleFTPPassword: null,
      advancedAnalytics: false,
      recurringCommissions: false,
      storesConnect: false,
      storesConnectStoreID: null,
      xtypeMode: null,
      dynamicXtypeValue: null,
      staticXtypeValue: null,
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
