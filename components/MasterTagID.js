import React, { useState, useCallback } from "react";
import { Card, TextField } from "@shopify/polaris";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

const MasterTagID = (props) => {
  const { merchantSettings } = props;

  const [textFieldMasterTagID, setTextFieldMasterTagID] = useState(
    merchantSettings.masterTagID
  );
  const handleMasterTagIDChange = useCallback(
    (newValue) => setTextFieldMasterTagID(newValue),
    []
  );

  const [updateShareASaleTag] = useMutation(
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
        onAction: async () => {
          const newMasterTagID = document.getElementById("masterTagID").value;
          // Rebuild tracking tag
          updateShareASaleTag({
            variables: {
              id: merchantSettings.trackingTagShopifyID,
              input: {
                src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${
                  merchantSettings.merchantID
                }&ssmtid=${newMasterTagID}&scid=${
                  merchantSettings.storesConnectStoreID
                }&xtm=${merchantSettings.xtypeMode}&xtv=${
                  merchantSettings.xtypeValue
                }&cd=${merchantSettings.channelDeduplication}`,
              },
            },
          }).then((x) => {
            console.log("I think we did it... go check");
          });
          // update master tag with new ID
          updateShareASaleTag({
            variables: {
              id: merchantSettings.masterTagShopifyID,
              input: {
                src: `https://www.dwin1.com/${newMasterTagID}.js`,
              },
            },
          })
            .then((x) => {
              // Update ID Number in MongoDB
              const fetchBody = {
                shop: props.shop,
                masterTagID: newMasterTagID,
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
                `We set the master tag as https://www.dwin1.com/${newMasterTagID}.js`
              );
            });
        },
      }}
    >
      <Card.Section>
        <TextField
          id="masterTagID"
          name="masterTagID"
          value={textFieldMasterTagID.toString()}
          onChange={handleMasterTagIDChange}
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
