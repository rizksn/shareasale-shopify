import React, { useState, useCallback, useEffect } from "react";
import { Card, TextField } from "@shopify/polaris";
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

const MerchantID = () => {
  const [MIDvalue, setMIDValue] = useState("");

  const handleMerchantIDChange = useCallback(
    (newValue) => setMIDValue(newValue),
    [MID]
  );

  const [createShareASaleTag] = useMutation(CREATE_SHAREASALE_TAG);
  const [createPrivateMetafield] = useMutation(CREATE_SHAREASALE_METAFIELD);

  const { loading, error, data } = useQuery(GET_MERCHANTID);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

  const MID = data.shop.privateMetafield.value;

  useEffect(() => {
    setMIDValue(MID);
  }, [MID]);

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
          createPrivateMetafield({
            variables: {
              input: {
                namespace: "shareasaleShopifyApp",
                key: "mid",
                valueInput: {
                  value: document.getElementById("shareasaleMerchantID").value,
                  valueType: "STRING",
                },
              },
            },
          }).then((x) => {
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
          value={MIDvalue}
          onChange={handleMerchantIDChange}
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
