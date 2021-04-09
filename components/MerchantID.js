import React from "react";
import { Card, TextField } from "@shopify/polaris";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo";
const os = require("os");

const MerchantID = (props) => {
  // First, look up the Shopify gid for the Tracking Tag
  const { loading: loadingTrackingTag, data: trackingTagQuery } = useQuery(gql`
    query {
      shop {
        privateMetafield(
          namespace: "shareasaleShopifyApp"
          key: "trackingTagShopifyID"
        ) {
          value
        }
      }
    }
  `);
  const [updateTrackingScript] = useMutation(
    gql`
      mutation($id: ID!, $input: ScriptTagInput!) {
        scriptTagUpdate(id: $id, input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `
  );
  if (loadingTrackingTag) {
    return <p>Loading...</p>;
  }
  return (
    <Card
      title="Merchant ID:"
      actions={[
        {
          content: "Edit",
          onAction: () => {
            {
              const shareasaleMerchantID = document.getElementById(
                "shareasaleMerchantID"
              );
              shareasaleMerchantID.removeAttribute("disabled");
            }
          },
        },
      ]}
      primaryFooterAction={{
        content: "Update Merchant ID",
        onAction: () => {
          const merchantID = document.getElementById("shareasaleMerchantID")
            .value;
          updateTrackingScript({
            variables: {
              id: `${trackingTagQuery.shop.privateMetafield.value}`,
              input: {
                src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${merchantID}&ssmtid=${
                  props.masterTID
                }`,
              },
            },
          }).then((x) => {
            console.log("I think we did it... go check");
          });
          props
            .createPrivateMetafield({
              variables: {
                input: {
                  namespace: "shareasaleShopifyApp",
                  key: "mid",
                  valueInput: {
                    value: document.getElementById("shareasaleMerchantID")
                      .value,
                    valueType: "STRING",
                  },
                },
              },
            })
            .then((x) => {
              const fetchBody = {
                shop: props.myshopifyDomain,
                merchantID:
                  x.data.privateMetafieldUpsert.privateMetafield.value,
              };
              fetch(`https://${os.hostname()}/api/editshop/`, {
                method: "POST",
                body: JSON.stringify(fetchBody),
              });
              console.log(
                `We set the MID as ${x.data.privateMetafieldUpsert.privateMetafield.value}`
              );
              const shareasaleMerchantID = document.getElementById(
                "shareasaleMerchantID"
              );
              shareasaleMerchantID.setAttribute("disabled", "");
            });
        },
      }}
    >
      <Card.Section>
        <TextField
          id="shareasaleMerchantID"
          value={props.merchantID}
          onChange={props.handleMerchantIDChange}
          disabled
          type="number"
        ></TextField>
        <br />
        <p>Note: ID number should match your ShareASale merchant ID</p>
      </Card.Section>
    </Card>
  );
};

export default MerchantID;
