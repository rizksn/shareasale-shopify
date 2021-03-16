const shareasaleScripts = document.getElementsByTagName("script");
for (let x of shareasaleScripts) {
  if (x.src.includes("shareasale-tracking.js")) {
    var shareasaleTrackingURL = new URL(x.src);
    break;
  }
}
if (Shopify.shop && shareasaleTrackingURL) {
  fetch(
    `http://corsanywhere.herokuapp.com/${shareasaleTrackingURL.origin}/api/order/`,
    {
      method: "GET",
      headers: {
        order_id: window.Shopify.checkout.order_id,
        shop: Shopify.shop,
      },
    }
  )
    .then((x) => {
      return x.json();
    })
    .then((x) => {
      console.log(x);
      createShareasalePixelURL(x.order);
    });
}
function createShareasalePixelURL(order) {
  var subtotal = order.subtotal_price,
    merchantID = "44911",
    currency = order.presentment_currency,
    skulist = [],
    pricelist = [],
    quantitylist = [],
    couponcodes = [],
    orderName,
    newcustomer;
  if (order.name) {
    orderName = order.name.split("#")[1] || order.name;
  } else {
    orderName = shareasaleGetOrderRef();
  }
  if (order.customer) {
    newcustomer = order.customer.orders_count <= 1 ? 1 : 0;
  } else {
    newcustomer = "";
  }
  if (order.discount_applications) {
    order.discount_applications.map((x) => {
      couponcodes.push(x.code);
    });
  } else if (order.discount) {
    couponcodes.push(order.discount.code);
  }
  order.line_items.map((x) => {
    skulist.push(x.sku);
    pricelist.push(x.price);
    quantitylist.push(x.quantity);
  });
  let shareasaleImage = new Image();
  shareasaleImage.src = `https://shareasale.com/sale.cfm?transtype=sale&merchantID=${merchantID}&amount=${subtotal}&tracking=${orderName}&currency=${currency}&newcustomer=${newcustomer}&skulist=${skulist}&pricelist=${pricelist}&quantitylist=${quantitylist}`;
  document.body.appendChild(shareasaleImage);
  let shareasaleMasterTag = document.createElement("script");
  shareasaleMasterTag.src = "https://www.dwin1.com/19038.js";
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
