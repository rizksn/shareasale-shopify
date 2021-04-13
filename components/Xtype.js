import React, { useCallback, useState } from "react";
import {
  Card,
  Stack,
  TextField,
  Button,
  Collapsible,
  TextContainer,
} from "@shopify/polaris";
import { QuestionMarkMajor } from "@shopify/polaris-icons";
const os = require("os");

const Xtype = (props) => {
  const { merchantSettings } = props;

  const [xtype, setXtype] = useState(merchantSettings.xtypeValue);
  const handleXtypeChange = useCallback((value) => setXtype(value));

  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card
      title="Merchant Defined Type (xtype) Tracking"
      actions={[
        {
          content: "Edit",
          onAction: () => {
            {
              const xtypeID = document.getElementById("xtype");
              xtypeID.removeAttribute("disabled");
            }
          },
        },
      ]}
      primaryFooterAction={{
        content: "Update xtype Value",
        onAction: () => {
          props
            .updateTrackingScript({
              variables: {
                id: `${merchantSettings.trackingTagShopifyID}`,
                input: {
                  src: `https://${os.hostname()}/shareasale-tracking.js?sasmid=${
                    merchantSettings.merchantID
                  }&ssmtid=${merchantSettings.masterTagID}&scid=${
                    merchantSettings.storesConnectStoreID
                  }&xtm=${merchantSettings.xtypeMode}&xtv=${xtype}&cd=${
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
                xtypeValue: xtype,
              };
              fetch(`https://${os.hostname()}/api/editshop/`, {
                method: "POST",
                body: JSON.stringify(fetchBody),
              });
              console.log(`We set the xtype value as ${xtype}`);
              const xtypeID = document.getElementById("xtype");
              xtypeID.setAttribute("disabled", "");
            });
        },
      }}
    >
      <Card.Section>
        <Stack distribution="fill" wrap={false} spacing="extraLoose">
          <div>
            <p>xtype static value or dynamic variable</p>
          </div>
          <div>
            <TextField
              id="xtype"
              value={xtype}
              onChange={handleXtypeChange}
              disabled
            />
          </div>
        </Stack>
        <Stack vertical>
          <Button
            icon={QuestionMarkMajor}
            onClick={handleToggle}
            ariaExpanded={open}
            ariaControls="basic-collapsible"
            outline
          ></Button>
          <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{ duration: "350ms", timingFunction: "ease-in-out" }}
            expandOnPrint
          >
            <TextContainer>
              <p>
                The Merchant Defined Type (xtype) tracking can be used to pass a
                static value or dynamic variable in the tracking pixel (xtype
                value).
              </p>
              <p>
                This xtype value can then be accessed from Tools -- Commission
                Rules in your ShareASale account to create particular commission
                structures/set commission rules around the xtype value.
              </p>
              <br />
            </TextContainer>
          </Collapsible>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default Xtype;
