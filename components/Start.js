import React from "react";
import { Page, Layout, EmptyState, Link, TextField } from "@shopify/polaris";

const Start = (props) => {
  return (
    <Page>
      <Layout>
        <EmptyState
          heading="To start, enter your ShareASale Merchant ID"
          action={{
            content: "Install Tracking",
            onAction: () => {
              // Check to see if the text field has a numeric value
              if (
                document
                  .getElementById("shareasaleMerchantID")
                  .value.match(/\d+/)
              ) {
                // Store the merchant ID in a private metafield
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
                      `MID Private Metafield: ${x.data.privateMetafieldUpsert.privateMetafield.value}`
                    );
                  });
                // Add the master tag
                props
                  .createShareASaleTag({
                    variables: {
                      input: {
                        src: "https://www.dwin1.com/19038.js",
                        displayScope: "ONLINE_STORE",
                      },
                    },
                  })
                  .then((x) => {
                    console.log(x);
                    props.createPrivateMetafield({
                      variables: {
                        input: {
                          namespace: "shareasaleShopifyApp",
                          key: "masterTagShopifyID",
                          valueInput: {
                            value: x.data.scriptTagCreate.scriptTag.id,
                            valueType: "STRING",
                          },
                        },
                      },
                    });
                    console.log(
                      `Stored the mastertag's Shopify ID: ${x.data.scriptTagCreate.scriptTag.id}`
                    );
                  })
                  .then(() => {
                    props
                      .createPrivateMetafield({
                        variables: {
                          input: {
                            namespace: "shareasaleShopifyApp",
                            key: "masterTagID",
                            valueInput: {
                              value: "19038",
                              valueType: "STRING",
                            },
                          },
                        },
                      })
                      .then((x) => {
                        console.log(
                          `masterTagID Private Metafield: ${x.data.privateMetafieldUpsert.privateMetafield.value}`
                        );
                        // console.log(`MID from query is ${MID}`);
                      });
                  });
                // Add the tracking tag
                props.createShareASaleTag({
                  variables: {
                    input: {
                      src: "https://851af24c5736.ngrok.io/tracking.js",
                      displayScope: "ALL",
                    },
                  },
                });
                // .then(() => refetch());
              } else {
                alert("Please enter a valid merchant ID");
              }
            },
          }}
          secondaryAction={{
            content: "ShareASale Login",
            url: "https://account.shareasale.com/m-main.cfm",
            external: true,
            outline: true,
          }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          footerContent={
            <p>
              New merchant?{" "}
              <Link
                external={true}
                monochrome
                url="https://www.shareasale.com/info/merchants/"
              >
                Learn More!
              </Link>
            </p>
          }
        >
          <TextField
            id="shareasaleMerchantID"
            value={props.merchantID}
            onChange={props.handleMerchantIDChange}
            type="number"
          />
        </EmptyState>
      </Layout>
    </Page>
  );
};

export default Start;