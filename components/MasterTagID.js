import React, { useState, useCallback } from "react";
import { Card, Stack, TextField } from "@shopify/polaris";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

const MasterTagID = (props) => {
  const [masterTagLoading, masterTagLoadingUpdate] = useState(false);
  const { merchantSettings } = props;
  const content =
    merchantSettings.masterTagID == "19038"
      ? "Your Master Tag is not configured for plugins."
      : "Your Master Tag is configured to work with publisher plugins.";
  const [masterTagContent, masterTagContentUpdate] = useState(content);
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
        loading: masterTagLoading,
        onAction: masterTagClicked,
      }}
    >
      <Card.Section>
        <Stack distribution="fill" wrap={false} spacing="extraLoose">
          <p>{masterTagContent}</p>
          <div>
            <TextField
              id="masterTagID"
              name="masterTagID"
              value={textFieldMasterTagID.toString()}
              onChange={handleMasterTagIDChange}
              disabled
              type="number"
            ></TextField>
          </div>
        </Stack>
      </Card.Section>
    </Card>
  );
  async function masterTagClicked() {
    const shareasaleMasterTagID = document.getElementById("masterTagID");
    const newMasterTagID = document.getElementById("masterTagID").value;
    masterTagLoadingUpdate(true);
    // Load the content of the new master tag, then check to see if it contains
    // references to ShareASale. If it does, then it's a valid master tag
    const newMasterTag = await fetch(
        `https://www.dwin1.com/${newMasterTagID}.js`
      ),
      newMasterTagContent = await newMasterTag.text();
    if (newMasterTagContent.includes("shareasale")) {
      // Rebuild tracking tag
      await updateShareASaleTag({
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
      });
      // update master tag with new ID
      await updateShareASaleTag({
        variables: {
          id: merchantSettings.masterTagShopifyID,
          input: {
            src: `https://www.dwin1.com/${newMasterTagID}.js`,
          },
        },
      });
      // Update ID Number in MongoDB
      const fetchBody = {
        shop: props.shop,
        masterTagID: newMasterTagID,
      };
      await fetch(`https://${os.hostname()}/api/editshop/`, {
        method: "POST",
        body: JSON.stringify(fetchBody),
      });
      shareasaleMasterTagID.setAttribute("disabled", "");
      merchantSettings.masterTagID = newMasterTagID;
      newMasterTagID == "19038 "
        ? masterTagContentUpdate(
            "Your Master Tag is not configured for plugins."
          )
        : masterTagContentUpdate(
            "Your Master Tag is configured to work with publisher plugins."
          );
      masterTagLoadingUpdate(false);
    } else {
      setTextFieldMasterTagID(merchantSettings.masterTagID);
      shareasaleMasterTagID.setAttribute("disabled", "");
      masterTagLoadingUpdate(false);
      masterTagContentUpdate(
        "Invalid Master Tag ID. Please reach out to ShareASale before editing this field."
      );
    }
  }
};

export default MasterTagID;
