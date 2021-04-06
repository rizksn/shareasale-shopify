const { GraphQLClient, gql } = require("graphql-request");
/**
 * Retrieves order information from the Shopify API
 * @param {string} shop The Shopify 'shop' identifier
 * @param {string|number} orderID Shopify order ID
 * @param {string} accessToken The Shopify access token for the shop
 * @returns The full order details from the Shopify API
 */
async function getOrder(shop, orderID, accessToken) {
  try {
    const endpoint = `https://${shop}/admin/api/2021-01/graphql.json`,
      graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
      }),
      query = gql`
        query {
          order(id: "gid://shopify/Order/${orderID}") {
            metafield (namespace: "shareasaleShopifyApp", key: "checked") {
              value
            }
            name
            createdAt
            customer {
              ordersCount
            }
          }
        }
      `,
      queryData = await graphQLClient
        .request(query)
        .catch((e) => console.log(e));
    // Example output from this call: { order: { metafield: null, name: '#1045', "createdAt": "2021-03-15T02:10:19Z", customer: { ordersCount: '0' } } }
    // Metafield property will be null if this is the first time the app has queried the order
    if (queryData.order.metafield == null) {
      const mutation = gql`
        mutation {
          orderUpdate (
            input: {
              id: "gid://shopify/Order/${orderID}",
              metafields: [{
                namespace: "shareasaleShopifyApp",
                key: "checked",
                value: "true",
                valueType: STRING
              }]
            }
          )
          {
            order {
              id
            }
          }
        }
      `;
      graphQLClient.request(mutation).catch((e) => console.log(e));
    }
    return queryData.order;
  } catch (e) {
    console.log(
      `GraphQL request failed for ${shop} on Shopify Order No. ${orderID}`
    );
    console.log(e);
  }
}
export default getOrder;
