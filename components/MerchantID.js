import React from "react";
import { Card, TextField } from "@shopify/polaris";

const MerchantID = (props) => {
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
