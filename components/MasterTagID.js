import React from "react";
import { Card, TextField } from "@shopify/polaris";

const MasterTagID = (props) => {
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
