import React, { useState, useCallback, useEffect } from "react";
import { Page, Layout, Card, Stack, Link } from "@shopify/polaris";
import MerchantID from "../components/MerchantID";
import MasterTagID from "../components/MasterTagID";

// const CREATE_SHAREASALE_TAG = gql`
//   mutation($input: ScriptTagInput!) {
//     scriptTagCreate(input: $input) {
//       scriptTag {
//         displayScope
//         id
//         src
//       }
//     }
//   }
// `;
// const CREATE_SHAREASALE_METAFIELD = gql`
//   mutation($input: PrivateMetafieldInput!) {
//     privateMetafieldUpsert(input: $input) {
//       privateMetafield {
//         namespace
//         key
//         value
//         valueType
//       }
//       userErrors {
//         field
//         message
//       }
//     }
//   }
// `;

// const GET_MERCHANTID = gql`
//   {
//     shop {
//       privateMetafield(namespace: "shareasaleShopifyApp", key: "mid") {
//         value
//         id
//       }
//     }
//   }
// `;

// const GET_MASTERTAGID = gql`
//   {
//     shop {
//       privateMetafield(namespace: "shareasaleShopifyApp", key: "masterTagID") {
//         value
//         id
//       }
//     }
//   }
// `;

const Dashboard = () => {
  return (
    <Page title="ShareASale Shopify Tracker" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card title="Merchant Account" sectioned>
            <Link url="https://www.shareasale.com/info/merchant-login/">
              Access your ShareASale merchant dashboard
            </Link>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card title="Documentation" sectioned>
            <Link url="https://shareasale.atlassian.net/wiki/spaces/SAS/overview">
              Access ShareASale's Wikipedia
            </Link>
          </Card>
        </Layout.Section>

        <Layout.Section oneThird>
          <MerchantID />
        </Layout.Section>

        <Layout.Section oneThird>
          <MasterTagID />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;
