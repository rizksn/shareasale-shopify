import React, { useState, useCallback } from "react";
import { Card, Stack, TextField } from "@shopify/polaris";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
const os = require("os");

const MerchantID = (props) => {
  const [merchantIDLoading, merchantIDLoadingUpdate] = useState(false);
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
        loading: merchantIDLoading,
        onAction: merchantIDClicked,
      }}
    >
      <Card.Section>
        <Stack distribution="fill" wrap={false} spacing="extraLoose">
          <div>
            <p>ID number should match your ShareASale merchant ID</p>
            <br />
            <p>
              Your merchant ID is listed in the upper left corner of your
              ShareASale merchant account
            </p>
          </div>
          <div>
            <TextField
              id="shareasaleMerchantID"
              value={textFieldMerchantID.toString()}
              onChange={handleMerchantIDTextFieldChange}
              disabled
              type="number"
            />
            <br />
          </div>
        </Stack>
      </Card.Section>
    </Card>
  );
  async function merchantIDClicked() {
    merchantIDLoadingUpdate(true);
    const merchantID = document.getElementById("shareasaleMerchantID").value;
    await updateTrackingScript({
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
    });

    const fetchBody = {
      shop: props.shop,
      merchantID: merchantID,
    };
    await fetch(`https://${os.hostname()}/api/editshop/`, {
      method: "POST",
      body: JSON.stringify(fetchBody),
    });

    const shareasaleMerchantID = document.getElementById(
      "shareasaleMerchantID"
    );
    shareasaleMerchantID.setAttribute("disabled", "");
    merchantIDLoadingUpdate(false);
  }
};

export default MerchantID;
