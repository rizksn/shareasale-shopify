import React, { useEffect } from "react";
import { useMutation, useQuery } from "react-apollo";
import gql from "graphql-tag";

import Start from "../components/Start";
import Dashboard from "../components/Dashboard";
import useForm from "../hooks/useForm";

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

const UPDATE_SHAREASLE_TAG = gql`
  mutation scriptTagUpdate($id: ID!, $input: ScriptTagInput!) {
    scriptTagUpdate(id: $id, input: $input) {
      scriptTag {
        displayScope
        id
        src
      }
      userErrors {
        field
        message
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

const GET_MASTERTAG_SHOP_ID = gql`
  {
    shop {
      privateMetafield(
        namespace: "shareasaleShopifyApp"
        key: "masterTagShopifyID"
      ) {
        value
        id
      }
    }
  }
`;

const GET_MASTERTAG_SHOPIFY_ID = gql`
  {
    scriptTags(first: 1, reverse: true) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const Index = () => {
  const {
    merchantID,
    handleMasterTagIDChange,
    handleMerchantIDChange,
    masterTID,
  } = useForm();

  const [createShareASaleTag] = useMutation(CREATE_SHAREASALE_TAG);
  const [updateShareASaleTag] = useMutation(UPDATE_SHAREASLE_TAG);
  const [createPrivateMetafield] = useMutation(CREATE_SHAREASALE_METAFIELD);

  const { data: masterTagID, refetch: refetchMasterTagID } = useQuery(
    GET_MASTERTAGID
  );

  const {
    data: masterTagShopifyID,
    refetch: refetchMasterTagShopifyID,
  } = useQuery(GET_MASTERTAG_SHOPIFY_ID);

  const { data: data2, refetch: refetch2 } = useQuery(GET_MASTERTAG_SHOP_ID);

  const { loading, error, data } = useQuery(GET_MERCHANTID);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

  // masterTagID: masterTagID.shop.privateMetafield.value,
  // shareasaleMerchantID: masterTagShopifyID.shop.privateMetafield.value,

  return (
    <>
      {data.shop.privateMetafield == null ? (
        <Start
          updateShareASaleTag={updateShareASaleTag}
          createPrivateMetafield={createPrivateMetafield}
          masterTagShopifyID={masterTagShopifyID}
          refetchMasterTagShopifyID={refetchMasterTagShopifyID}
          masterTagID={masterTagID}
          refetchMasterTagID={refetchMasterTagID}
          createShareASaleTag={createShareASaleTag}
          merchantID={merchantID}
          masterTID={masterTID}
          handleMerchantIDChange={handleMerchantIDChange}
          handleMasterTagIDChange={handleMasterTagIDChange}
        />
      ) : (
        <Dashboard
          // values={values}
          // handleChange={handleChange}
          updateShareASaleTag={updateShareASaleTag}
          createPrivateMetafield={createPrivateMetafield}
          masterTagShopifyID={masterTagShopifyID}
          refetchMasterTagShopifyID={refetchMasterTagShopifyID}
          masterTagID={masterTagID}
          refetchMasterTagID={refetchMasterTagID}
          data2={data2}
          refetch2={refetch2}
          merchantID={merchantID}
          masterTID={masterTID}
          handleMerchantIDChange={handleMerchantIDChange}
          handleMasterTagIDChange={handleMasterTagIDChange}

          // setMerchantID={setMerchantID}
          // setMasterTagID={setMasterTagID}
        />
      )}
    </>
  );
};

export default Index;
