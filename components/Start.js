import React, { useState, useCallback } from "react";
import { Page, Layout, EmptyState, Link, TextField } from "@shopify/polaris";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

const CREATE_SHAREASALE_TAG = gql`
  mutation($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        displayScope
        id
        src
      }
    }
  }
`;
const CREATE_WEBHOOK_SUBSCRIPTION = gql`
  mutation webhookSubscriptionCreate(
    $topic: WebhookSubscriptionTopic!
    $webhookSubscription: WebhookSubscriptionInput!
  ) {
    webhookSubscriptionCreate(
      topic: $topic
      webhookSubscription: $webhookSubscription
    ) {
      userErrors {
        field
        message
      }
      webhookSubscription {
        id
      }
    }
  }
`;

const Start = (props) => {
  const [createWebhookSubscription] = useMutation(CREATE_WEBHOOK_SUBSCRIPTION);
  const [createShareASaleTag] = useMutation(CREATE_SHAREASALE_TAG);
  const [textFieldMerchantID, setTextFieldMerchantID] = useState("");
  const handleMerchantIDTextFieldChange = useCallback((newValue) => {
    if (newValue.match(/^\d*$/gi)) {
      setTextFieldMerchantID(newValue);
    }
  }, []);

  return (
    <Page>
      <Layout>
        <EmptyState
          heading="To start, enter your ShareASale Merchant ID"
          action={{
            content: "Install Tracking",
            onAction: () => {
              merchantStart(
                props.shop,
                createShareASaleTag,
                createWebhookSubscription
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
            value={textFieldMerchantID}
            onChange={handleMerchantIDTextFieldChange}
          />
        </EmptyState>
      </Layout>
    </Page>
  );
};

async function merchantStart(
  shop,
  createShareASaleTag,
  createWebhookSubscription
) {
  // Check to see if the text field has a numeric value
  if (document.getElementById("shareasaleMerchantID").value.match(/\d+/)) {
    const merchantID = document.getElementById("shareasaleMerchantID").value,
      // Add the master tag
      masterTag = await createShareASaleTag({
        variables: {
          input: {
            src: "https://www.dwin1.com/19038.js",
            displayScope: "ONLINE_STORE",
          },
        },
      }),
      trackingTag = await createShareASaleTag({
        variables: {
          input: {
            src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${merchantID}&ssmtid=19038`,
            displayScope: "ORDER_STATUS",
          },
        },
      }),
      fetchBody = {
        shop: shop,
        merchantID: merchantID,
        masterTagShopifyID: masterTag.data.scriptTagCreate.scriptTag.id,
        trackingTagShopifyID: trackingTag.data.scriptTagCreate.scriptTag.id,
      };
    await fetch(`https://${os.hostname()}/api/editshop/`, {
      method: "POST",
      body: JSON.stringify(fetchBody),
    });
    await createWebhookSubscription({
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
