import React from "react";
import { Card, TextField } from "@shopify/polaris";
import { useQuery, useMutation } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

const MasterTagID = (props) => {
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
      title="Master Tag ID:"
      actions={[
        {
          content: "Edit",
          onAction: () => {
            {
              const shareasaleMasterTagID = document.getElementById(
                "masterTagID"
              );
              shareasaleMasterTagID.removeAttribute("disabled");
            }
          },
        },
      ]}
      primaryFooterAction={{
        content: "Update Master Tag ID",
        onAction: () => {
          updateTrackingScript({
            variables: {
              id: `${trackingTagQuery.shop.privateMetafield.value}`,
              input: {
                src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${
                  props.merchantID
                }&ssmtid=${document.getElementById("masterTagID").value}`,
              },
            },
          }).then((x) => {
            console.log("I think we did it... go check");
          });
          // update master tag ID metafield
          props
            .createPrivateMetafield({
              variables: {
                input: {
                  namespace: "shareasaleShopifyApp",
                  key: "masterTagID",
                  valueInput: {
                    value: document.getElementById("masterTagID").value,
                    valueType: "STRING",
                  },
                },
              },
            })
            .then((x) => {
              console.log(
                `updated masterTagID metafield: ${x.data.privateMetafieldUpsert.privateMetafield.value}`
              );
              props
                .updateShareASaleTag({
                  variables: {
                    id: props.masterTagShopifyID.shop.privateMetafield.value,
                    input: {
                      src: `https://www.dwin1.com/${props.masterTID}.js`,
                      displayScope: "ONLINE_STORE",
                    },
                  },
                })
                .then((x) => {
                  // Update ID Number in MongoDB
                  const fetchBody = {
                    shop: props.myshopifyDomain,
                    masterTagID: props.masterTID,
                  };
                  fetch(`https://${os.hostname()}/api/editshop/`, {
                    method: "POST",
                    body: JSON.stringify(fetchBody),
                  });
                  const shareasaleMasterTagID = document.getElementById(
                    "masterTagID"
                  );
                  shareasaleMasterTagID.setAttribute("disabled", "");
                })
                .then((x) => {
                  console.log(
                    `We set the master tag as https://www.dwin1.com/${props.masterTID}.js`
                  );
                });
            });
        },
      }}
    >
      <Card.Section>
        <TextField
          id="masterTagID"
          name="masterTagID"
          value={props.masterTID}
          onChange={props.handleMasterTagIDChange}
          disabled
          type="number"
        ></TextField>
        <br />
        <p>
          Note: please do not edit the master tag ID without prior authorization
        </p>
      </Card.Section>
    </Card>
  );
};

export default MasterTagID;
