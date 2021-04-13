import React, { useCallback, useState } from "react";
import { Card, Stack, TextField } from "@shopify/polaris";
const os = require("os");

const StoreID = (props) => {
  const { merchantSettings } = props;

  const [storesConnectStoreID, setStoreID] = useState(
    merchantSettings.storesConnectStoreID
  );

  const handleStoreIDChange = useCallback((value) => setStoreID(value));

  return (
    <Card
      title="Store ID"
      actions={[
        {
          content: "Edit",
          onAction: () => {
            {
              const storeIDID = document.getElementById("storeID");
              storeIDID.removeAttribute("disabled");
            }
          },
        },
      ]}
      primaryFooterAction={{
        content: "Update Store ID",
        onAction: () => {
          props
            .updateTrackingScript({
              variables: {
                id: `${merchantSettings.trackingTagShopifyID}`,
                input: {
                  src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${
                    merchantSettings.merchantID
                  }&ssmtid=${
                    merchantSettings.masterTagID
                  }&scid=${storesConnectStoreID}&xtm=${
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
                storesConnectStoreID: storesConnectStoreID,
              };
              fetch(`https://${os.hostname()}/api/editshop/`, {
                method: "POST",
                body: JSON.stringify(fetchBody),
              });
              console.log(`We set the store ID as ${storesConnectStoreID}`);
              const shareasaleMerchantID = document.getElementById("storeID");
              shareasaleMerchantID.setAttribute("disabled", "");
            });
        },
      }}
    >
      <Card.Section>
        <Stack distribution="fill" wrap={false} spacing="extraLoose">
          <div>
            <p>
              Note: please do not enter/edit the Store ID without prior
              authorization
            </p>
          </div>
          <div>
            <TextField
              id="storeID"
              value={storesConnectStoreID}
              onChange={handleStoreIDChange}
              disabled
              type="number"
            />
          </div>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default StoreID;
