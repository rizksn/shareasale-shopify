// check for troubleshooting parameter
const shareasaleScripts = document.getElementsByTagName("script"),
  shareasaleLocation = new URL(window.location.href),
  shareasaleTroubleshooting = shareasaleLocation.searchParams.get(
    "troubleshooting"
  );
// get master tag ID and merchant ID from shareasale-tracking.js script
for (let x of shareasaleScripts) {
  if (x.src.includes("shareasale-tracking.js")) {
    var shareasaleTrackingURL = new URL(x.src),
      masterTagID = shareasaleTrackingURL.searchParams.get("ssmtid"),
      merchantID = shareasaleTrackingURL.searchParams.get("sasmid");
    console.log(shareasaleTrackingURL);
    break;
  }
}

// check for sas_m_awin cookie
const sas_m_awin_cookie = shareasaleGetCookie("sas_m_awin");
// set Beacon URL - pass checkout object as the order
const shareasaleBeaconURL = createShareasalePixelURL(Shopify.checkout);

// if shop and sas_m_awin cookie returned
if (Shopify.shop && sas_m_awin_cookie) {
  // >> add beacon event listener
  document.addEventListener("visibilitychange", fireShareasaleBeacon);
  // >> store order ID and shop
  const shareasaleFetchBody = {
    order_id: window.Shopify.checkout.order_id,
    shop: Shopify.shop,
  };
  // >> post order ID and shop to api/order/ endpoint
  fetch(
    `http://corsanywhere.herokuapp.com/${shareasaleTrackingURL.origin}/api/order/`,
    {
      method: "POST",
      body: JSON.stringify(shareasaleFetchBody),
    }
  ) // return order metafield - order ID & new customer status
    .then((x) => {
      return x.json();
    })
    .then((x) => {
      console.log(x);
      // remove beacon event listener
      document.removeEventListener("visibilitychange", fireShareasaleBeacon);
      // set shareasale pixel URL
      const shareasalePixelURL = createShareasalePixelURL(x);
      // append pixel to confirmation page
      if (shareasalePixelURL) {
        shareasalePixelAppend(shareasalePixelURL, masterTagID);
      }
    })
    .catch((x) => {
      console.log("Pixel Failed. Sending fallback beacon: " + x);
      fireShareasaleBeacon();
      document.removeEventListener("visibilitychange", fireShareasaleBeacon);
    });
}

function createShareasalePixelURL(order) {
  var sas_merchantID = "44911",
    sas_currency = Shopify.checkout.presentment_currency,
    sas_skulist = [],
    sas_pricelist = [],
    sas_quantitylist = [],
    sas_couponcode = Shopify.checkout.discount
      ? Shopify.checkout.discount.code
      : "",
    sas_totalDiscounts = Shopify.checkout.discount
      ? parseFloat(Shopify.checkout.discount.amount)
      : 0,
    sas_subtotal = parseFloat(Shopify.checkout.subtotal_price),
    sas_orderRatio =
      1 - sas_totalDiscounts / (sas_subtotal + sas_totalDiscounts);
  if (order.name) {
    shareasaleOrderDate = new Date(order.createdAt);
    if (order.metafield?.value && shareasaleTroubleshooting != 1) {
      console.log("ShareASale Pixel previously triggered");
      return;
    }
    if (
      Date.now() - shareasaleOrderDate > 3600000 &&
      shareasaleTroubleshooting != 1
    ) {
      console.log("Order is older than 26 hours");
      return;
    }
    var sas_orderName = order.name.split("#")[1] || order.name,
      sas_newcustomer = order.customer.orders_count <= 1 ? 1 : 0,
      sas_version = "shopify_app_1.0_pixel";
  } else {
    var sas_orderName = shareasaleGetOrderRef(),
      sas_newcustomer = "",
      sas_sscid = sas_m_awin_cookie
        ? JSON.parse(sas_m_awin_cookie).clickId
        : null,
      sas_version = "shopify_app_1.0_beacon";
  }
  Shopify.checkout.line_items.map((x) => {
    sas_skulist.push(x.sku);
    sas_pricelist.push((x.price * sas_orderRatio).toFixed(2));
    sas_quantitylist.push(x.quantity);
  });
  var shareasalePixelURL = `https://shareasale.com/sale.cfm?transtype=sale&merchantID=${sas_merchantID}&amount=${sas_subtotal}&tracking=${sas_orderName}&currency=${sas_currency}&newcustomer=${sas_newcustomer}&skulist=${sas_skulist}&pricelist=${sas_pricelist}&quantitylist=${sas_quantitylist}&couponcode=${sas_couponcode}&v=${sas_version}`;
  if (sas_sscid) {
    shareasalePixelURL += `&sscid=${sas_sscid}&sscidmode=6`;
  }
  return shareasalePixelURL;
}

function shareasalePixelAppend(url, mastertagID) {
  var shareasaleImage = new Image();
  shareasaleImage.src = url;
  document.body.appendChild(shareasaleImage);
  var shareasaleMasterTag = document.createElement("script");
  shareasaleMasterTag.src = `https://www.dwin1.com/${mastertagID}.js`;
  document.body.appendChild(shareasaleMasterTag);
}

function shareasaleGetOrderRef() {
  var orderRef;
  try {
    var orderLabel = document.querySelector(".os-order-number");
    if (orderLabel !== null) {
      orderRef = orderLabel.innerText.split("#")[1];
      if (!orderRef) {
        orderRef = orderLabel.innerText.split(" ")[1];
      }
    }
    if (!orderRef) {
      orderRef = window.Shopify.checkout.order_id;
    }
    if (!orderRef) {
      throw Error("order_ref_error");
    }
  } catch (err) {
    console.log(
      "ShareASale: error getting orderRef from page. Using timestamp."
    );
    orderRef = Date.now();
  }
  return orderRef;
}

function shareasaleGetCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function fireShareasaleBeacon() {
  if (document.visibilityState === "hidden") {
    navigator.sendBeacon(createShareasalePixelURL(Shopify.checkout));
  }
}

function appendBasicPixel() {
  const shareasaleBasicPixel = new Image();
  shareasaleBasicPixel.src = createShareasalePixelURL(Shopify.checkout);
  document.body.appendChild();
}
