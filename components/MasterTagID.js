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

const GET_MASTERTAGID = gql`
  {
    shop {
      privateMetafield(namespace: "shareasaleShopifyApp", key: "masterTagID") {
        value
        id
      }
    }
  }
`;

const MasterTagID = () => {
  const [masterTagID, setMasterTagID] = useState("");

  const handleMasterTagIDChange = useCallback(
    (newValue) => setMasterTagID(newValue),
    [masterTagID]
  );

  const [createShareASaleTag] = useMutation(CREATE_SHAREASALE_TAG);
  const [createPrivateMetafield] = useMutation(CREATE_SHAREASALE_METAFIELD);

  const { loading: loading2, error: error2, data: data2 } = useQuery(
    GET_MASTERTAGID
  );

  if (loading2) return <p>Loading...</p>;
  if (error2) return <p>{`Error: ${error.message}`}</p>;

  const MTID = data2.shop.privateMetafield.value;

  // useEffect(() => {
  //   setMasterTagID(MTID);
  // }, [MTID]);

  console.log(MTID);

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
          createPrivateMetafield({
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
          }).then((x) => {
            console.log(
              `We set the master tag ID as ${x.data.privateMetafieldUpsert.privateMetafield.value}`
            );
          }),
            createShareASaleTag({
              variables: {
                input: {
                  src: `https://www.dwin1.com/${masterTagID}.js`,
                  displayScope: "ONLINE_STORE",
                },
              },
            }).then((x) => {
              const shareasaleMasterTagID = document.getElementById(
                "masterTagID"
              );
              shareasaleMasterTagID.setAttribute("disabled", "");
            });
        },
      }}
    >
      <Card.Section>
        <TextField
          id="masterTagID"
          value={masterTagID}
          onChange={handleMasterTagIDChange}
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
