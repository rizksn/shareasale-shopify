/**
 * Invoked to filter out information that we do not require from the Shopify Order API
 * @param {string} order The order object returned from the Shopify API
 * @returns The filtered order object
 */
function processOrder(order) {
  try {
    var processedOrder = {
      created_at: order.created_at,
      currency: order.currency,
      customer: {
        currency: order.customer.currency,
        orders_count: order.customer.orders_count,
      },
      discount_applications: order.discount_applications,
      line_items: order.line_items,
      name: order.name,
      order_number: order.order_number,
      presentment_currency: order.presentment_currency,
      subtotal_price: order.subtotal_price,
      subtotal_price_set: order.subtotal_price_set,
      total_discounts: order.total_discounts,
      total_price: order.total_price,
    };
  } catch (e) {
    console.log(e);
    return false;
  }
  return processedOrder;
}
export default processOrder;
