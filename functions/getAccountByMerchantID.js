/**
 * Returns account data from MongoDB
 * @param {string|number} mid The merchant ID from Shareasale
 * @returns All account information we have stored in MongoDB for this merchant ID
 */
async function getAccountByMerchantID(mid) {
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
    const query = { merchantID: parseInt(mid) };
    console.log(JSON.stringify(query));
    const account = await accounts.findOne(query);
    await client.close();
    return account;
  } catch (e) {
    console.log(e);
    await client.close();
  }
}
export default getAccountByMerchantID;
