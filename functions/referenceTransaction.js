async function referenceTransaction(
  originalOrderNumber,
  originalTransdate,
  amount,
  tracking,
  merchantID,
  apiToken,
  apiSecret
) {
  const fetch = require("node-fetch"),
    crypto = require("crypto"),
    newTracking = tracking.split("#")[1] || tracking,
    date = new Date(originalTransdate),
    // Format the date to mm/dd/yyyy
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

  var my_merchant_id = merchantID,
    api_token = apiToken,
    api_secret_key = apiSecret,
    api_version = 2.9,
    action_verb = "reference",
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
    url = `https://shareasale.com/w.cfm?transtype=sale&merchantId=${my_merchant_id}&token=${api_token}&version=${api_version}&action=${action_verb}&ordernumber=${originalOrderNumber}&date=${dateFormatted}&amount=${amount}&tracking=${newTracking}`,
    // execute request
    request = await fetch(url, {
      method: "GET",
      headers: my_headers,
    }),
    // log the response from ShareASale
    response = await request.text();
  console.log(response.trim());
  console.log(url);
}

export default referenceTransaction;
