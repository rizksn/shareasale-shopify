import React from "react";
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

const GET_MASTERTAG_SHOPIFY_ID = gql`
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

const CREATE_WEBHOOK_SUBSCRIPTION = gql`
  mutation webhookSubscriptionCreate(
    $topic: WebhookSubscriptionTopic!
    $webhookSubscription: WebhookSubscriptionInput!
  ) {
    webhookSubscriptionCreate(
      topic: $topic
      webhookSubscription: $webhookSubscription
    ) {
      userErrors {
        field
        message
      }
      webhookSubscription {
        id
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
  const [createWebhookSubscription] = useMutation(CREATE_WEBHOOK_SUBSCRIPTION);

  const { loading, error, data } = useQuery(GET_MERCHANTID, {});
  const { data: masterTagShopifyID } = useQuery(GET_MASTERTAG_SHOPIFY_ID);
  const { data: masterTagID } = useQuery(GET_MASTERTAGID);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

  return (
    <>
      {data.shop.privateMetafield == null ? (
        <Start
          updateShareASaleTag={updateShareASaleTag}
          createPrivateMetafield={createPrivateMetafield}
          createWebhookSubscription={createWebhookSubscription}
          masterTagID={masterTagID}
          createShareASaleTag={createShareASaleTag}
          merchantID={merchantID}
          masterTID={masterTID}
          handleMerchantIDChange={handleMerchantIDChange}
          handleMasterTagIDChange={handleMasterTagIDChange}
        />
      ) : (
        <Dashboard
          updateShareASaleTag={updateShareASaleTag}
          createPrivateMetafield={createPrivateMetafield}
          masterTagID={masterTagID}
          masterTagShopifyID={masterTagShopifyID}
          merchantID={merchantID}
          masterTID={masterTID}
          handleMerchantIDChange={handleMerchantIDChange}
          handleMasterTagIDChange={handleMasterTagIDChange}
        />
      )}
    </>
  );
};

export default Index;
