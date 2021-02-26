import React, { useState, useCallback } from "react";
import { Page, Layout } from "@shopify/polaris";
import { useMutation, useQuery } from "react-apollo";
import gql from "graphql-tag";

import Start from "../components/Start";
import Dashboard from "../components/Dashboard";

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

const Index = () => {
  const { loading, error, data } = useQuery(GET_MERCHANTID);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

  console.log(data);

  return <>{data.shop.privateMetafield == null ? <Start /> : <Dashboard />}</>;
};

export default Index;
