import React, { useState, useCallback } from "react";
import { Card, TextField } from "@shopify/polaris";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
const os = require("os");

const MerchantID = (props) => {
  const { merchantSettings } = props;
  const [textFieldMerchantID, setTextFieldMerchantID] = useState(
    merchantSettings.merchantID
  );
  const handleMerchantIDTextFieldChange = useCallback(
    (newValue) => setTextFieldMerchantID(newValue),
    []
  );

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
          console.log(merchantSettings.trackingTagShopifyID);
          updateTrackingScript({
            variables: {
              id: `${merchantSettings.trackingTagShopifyID}`,
              input: {
                src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${merchantID}&ssmtid=${
                  merchantSettings.masterTagID
                }&scid=${merchantSettings.storesConnectStoreID}&xtm=${
                  merchantSettings.xtypeMode
                }&xtv=${merchantSettings.xtypeValue}&cd=${
                  merchantSettings.channelDeduplication
                }`,
              },
            },
          })
            .then((x) => {
              console.log("I think we did it... go check");
            })
            .then((x) => {
              const fetchBody = {
                shop: props.shop,
                merchantID: merchantID,
              };
              fetch(`https://${os.hostname()}/api/editshop/`, {
                method: "POST",
                body: JSON.stringify(fetchBody),
              });
              console.log(`We set the MID as ${merchantID}`);
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
          value={textFieldMerchantID.toString()}
          onChange={handleMerchantIDTextFieldChange}
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
