import React, { useState, useCallback } from "react";
import {
  Heading,
  Page,
  EmptyState,
  Layout,
  Link,
  TextField,
} from "@shopify/polaris";
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

function Index() {
  const [value, setValue] = useState("");
  const handleChange = useCallback((newValue) => setValue(newValue), []);
  const [createShareASaleTag] = useMutation(CREATE_SHAREASALE_TAG);
  const [createPrivateMetafield] = useMutation(CREATE_SHAREASALE_METAFIELD);

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
                });
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
}

export default Index;
