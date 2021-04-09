/**
 * Edits a merchant's listing in MongoDB
 * @param {string} shop The myshopify domain
 * @param {string} merchantID ShareASale merchant ID
 * @param {string} masterTagID Awin Master Tag ID
 * @param {string} apiToken ShareASale API Token
 * @param {string} apiSecret ShareASale API Secret Key
 * @param {string} shareasaleFTPUsername Username for ShareASale FTP
 * @param {string} shareasaleFTPPassword Password for ShareASale FTP
 * @param {boolean} advancedAnalytics Advanced Analytics package enabled?
 * @param {boolean} recurringCommissions Recurring commissions enabled?
 * @param {boolean} autoReconciliation Auto reconciliation enabled?
 * @param {boolean} storesConnect StoresConnect enabled?
 * @param {number} storesConnectStoreID Store ID for StoresConnect
 * @param {string} xtypeMode Enter 'static' or 'dynamic'
 * @param {string} dynamicXtypeValue Value for dynamic xtype
 * @param {string} staticXtypeValue Value for static xtype
 * @param {boolean} channelDeduplication Whether or not to dedupe by channel
 */
async function editShop(
  input /*
  shop,
  merchantID,
  masterTagID,
  apiToken,
  apiSecret,
  shareasaleFTPUsername,
  shareasaleFTPPassword,
  advancedAnalytics,
  recurringCommissions,
  autoReconciliation,
  storesConnect,
  storesConnectStoreID,
  xtypeMode,
  dynamicXtypeValue,
  staticXtypeValue,
  channelDeduplication*/
) {
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
    if (input.storesConnect) {
      updateDoc.$set = {
        ...updateDoc.$set,
        storesConnect: input.storesConnect,
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
    if (input.dynamicXtypeValue) {
      updateDoc.$set = {
        ...updateDoc.$set,
        dynamicXtypeValue: input.dynamicXtypeValue,
      };
    }
    if (input.staticXtypeValue) {
      updateDoc.$set = {
        ...updateDoc.$set,
        staticXtypeValue: input.staticXtypeValue,
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
