/**
 * Void a transaction via the ShareASale API
 * @param {object} order Order data received from Shopify webhook
 * @param {string|number} merchantID ShareASale merchant ID
 * @param {string} apiToken ShareASale API Token
 * @param {string} apiSecret ShareASale API Secret Key
 */
async function voidOrder(order, merchantID, apiToken, apiSecret) {
  const fetch = require("node-fetch"),
    crypto = require("crypto"),
    orderName = order.name.split("#")[1] || ctx.request.body.name,
    reason = "Order Refunded (Shopify App)",
    date = new Date(order.created_at),
    // Format the date to mm/dd/yyyy (NOT actually necessary like our documentation says)
    // ShareASale API has a 1-2 day buffer for dates, so no need to convert time zones
    dateFormatted =
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      date.getFullYear();

  // credentials and request params

  var my_merchant_id = 44911,
    api_token = "UHf2ge6r1FViev0n",
    api_secret_key = "SGs3ec1z7ZJile1eKSk3vb0j1JHpdo0v",
    api_version = 2.9,
    action_verb = "void",
    my_timestamp = new Date().toUTCString(),
    // authentication
    sig =
      api_token + ":" + my_timestamp + ":" + action_verb + ":" + api_secret_key,
    sig_hash = crypto.createHash("sha256").update(sig).digest("hex"),
    my_headers = {
      "x-ShareASale-Date": my_timestamp,
      "x-ShareASale-Authentication": sig_hash,
    },
    // setup request params
    url = `https://shareasale.com/w.cfm?merchantId=${my_merchant_id}&token=${api_token}&version=${api_version}&action=${action_verb}&ordernumber=${orderName}&date=${dateFormatted}&reason=${reason}`,
    // execute request
    request = await fetch(url, {
      method: "GET",
      headers: my_headers,
    }),
    // log the response from ShareASale
    response = await request.text();
  console.log(response.trim());
}

export default voidOrder;
