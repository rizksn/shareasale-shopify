/**
 * Call any time a merchant updates their merchant ID
 * @param {string} shopifyShop The shop from Shopify: example.myshopify.com
 * @param {string|number} shareasaleMerchantID The client's ShareASale merchant ID
 */
async function updateMerchantID(shopifyShop, shareasaleMerchantID) {
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
    // create a filter for a movie to update
    const filter = { shop: shopifyShop };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    // create a document that sets the merchant ID
    const updateDoc = {
      $set: {
        merchantID: shareasaleMerchantID,
      },
    };
    const result = await accounts.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

export default updateMerchantID;
