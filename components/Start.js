import React from "react";
import { Page, Layout, EmptyState, Link, TextField } from "@shopify/polaris";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

const Start = (props) => {
  const { data: shopQuery } = useQuery(gql`
    query {
      shop {
        myshopifyDomain
      }
    }
  `);
  return (
    <Page>
      <Layout>
        <EmptyState
          heading="To start, enter your ShareASale Merchant ID"
          action={{
            content: "Install Tracking",
            onAction: () => {
              merchantStart(
                shopQuery.shop.myshopifyDomain,
                props.createPrivateMetafield,
                props.createShareASaleTag,
                props.createWebhookSubscription
              );
            },
          }}
          secondaryAction={{
            content: "ShareASale Login",
            url: "https://account.shareasale.com/m-main.cfm",
            external: true,
            outline: true,
          }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          footerContent={
            <p>
              New merchant?{" "}
              <Link
                external={true}
                monochrome
                url="https://www.shareasale.com/info/merchants/"
              >
                Learn More!
              </Link>
            </p>
          }
        >
          <TextField
            id="shareasaleMerchantID"
            value={props.merchantID}
            onChange={props.handleMerchantIDChange}
            type="number"
          />
        </EmptyState>
      </Layout>
    </Page>
  );
};

async function merchantStart(
  shop,
  createPrivateMetafield,
  createShareASaleTag,
  createWebhookSubscription
) {
  // Check to see if the text field has a numeric value
  if (document.getElementById("shareasaleMerchantID").value.match(/\d+/)) {
    const merchantID = document.getElementById("shareasaleMerchantID").value,
      fetchBody = {
        shop: shop,
        merchantID: merchantID,
      };
    fetch(`https://${os.hostname()}/api/editshop/`, {
      method: "POST",
      body: JSON.stringify(fetchBody),
    });
    // Store the merchant ID in a private metafield
    createPrivateMetafield({
      variables: {
        input: {
          namespace: "shareasaleShopifyApp",
          key: "mid",
          valueInput: {
            value: merchantID,
            valueType: "STRING",
          },
        },
      },
    });
    createPrivateMetafield({
      variables: {
        input: {
          namespace: "shareasaleShopifyApp",
          key: "masterTagID",
          valueInput: {
            value: "19038",
            valueType: "STRING",
          },
        },
      },
    });
    // Add the master tag
    createShareASaleTag({
      variables: {
        input: {
          src: "https://www.dwin1.com/19038.js",
          displayScope: "ONLINE_STORE",
        },
      },
    }).then((x) => {
      createPrivateMetafield({
        variables: {
          input: {
            namespace: "shareasaleShopifyApp",
            key: "masterTagShopifyID",
            valueInput: {
              value: x.data.scriptTagCreate.scriptTag.id,
              valueType: "STRING",
            },
          },
        },
      });
    });
    // Add the tracking tag
    createShareASaleTag({
      variables: {
        input: {
          src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${merchantID}&ssmtid=19038`,
          displayScope: "ORDER_STATUS",
        },
      },
    }).then((x) => {
      createPrivateMetafield({
        variables: {
          input: {
            namespace: "shareasaleShopifyApp",
            key: "trackingTagShopifyID",
            valueInput: {
              value: x.data.scriptTagCreate.scriptTag.id,
              valueType: "STRING",
            },
          },
        },
      });
    });
    createWebhookSubscription({
      variables: {
        topic: "APP_UNINSTALLED",
        webhookSubscription: {
          callbackUrl: `https://${os.hostname()}/api/webhooks/`,
          format: "JSON",
        },
      },
    }).then(window.location.reload());
  } else {
    alert("Please enter a valid merchant ID");
  }
}

export default Start;
