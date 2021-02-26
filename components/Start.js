import React, { useState, useCallback } from "react";
import { Page, Layout, EmptyState, Link, TextField } from "@shopify/polaris";
import gql from "graphql-tag";
import { useMutation, useQuery } from "react-apollo";

const CREATE_SHAREASALE_TAG = gql`
  mutation($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        displayScope
        id
        src
      }
    }
  }
`;
const CREATE_SHAREASALE_METAFIELD = gql`
  mutation($input: PrivateMetafieldInput!) {
    privateMetafieldUpsert(input: $input) {
      privateMetafield {
        namespace
        key
        value
        valueType
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_MERCHANTID = gql`
  {
    shop {
      privateMetafield(namespace: "shareasaleShopifyApp", key: "mid") {
        value
        id
      }
    }
  }
`;

const Start = () => {
  const [value, setValue] = useState("");
  const handleChange = useCallback((newValue) => setValue(newValue), []);

  const [createShareASaleTag] = useMutation(CREATE_SHAREASALE_TAG);
  const [createPrivateMetafield] = useMutation(CREATE_SHAREASALE_METAFIELD);

  const { loading, error, data, refetch } = useQuery(GET_MERCHANTID);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

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
                createPrivateMetafield({
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
                }).then((x) => {
                  console.log(
                    `We set the MID as ${x.data.privateMetafieldUpsert.privateMetafield.value}`
                  );
                  // console.log(`MID from query is ${MID}`);
                });
                createPrivateMetafield({
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
                }).then((x) => {
                  console.log(
                    `We set the master tag ID as ${x.data.privateMetafieldUpsert.privateMetafield.value}`
                  );
                  // console.log(`MID from query is ${MID}`);
                });
                // Add the master tag
                createShareASaleTag({
                  variables: {
                    input: {
                      src: "https://www.dwin1.com/19038.js",
                      displayScope: "ONLINE_STORE",
                    },
                  },
                });
                // Add the tracking tag
                createShareASaleTag({
                  variables: {
                    input: {
                      src: "https://851af24c5736.ngrok.io/tracking.js",
                      displayScope: "ALL",
                    },
                  },
                }).then(() => refetch());
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
            value={value}
            onChange={handleChange}
          />
        </EmptyState>
      </Layout>
    </Page>
  );
};

export default Start;
