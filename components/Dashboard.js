import React from "react";
import { Page, Layout, Card, Stack, Link } from "@shopify/polaris";
import gql from "graphql-tag";
import MerchantID from "../components/MerchantID";
import MasterTagID from "../components/MasterTagID";

const Dashboard = (props) => {
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
          <Card title="Wiki" sectioned>
            <Link url="https://shareasale.atlassian.net/wiki/spaces/SAS/overview">
              Access ShareASale's documentation & FAQs
            </Link>
          </Card>
        </Layout.Section>

        <Layout.Section oneThird>
          <MerchantID
            updateShareASaleTag={props.updateShareASaleTag}
            createPrivateMetafield={props.createPrivateMetafield}
            merchantID={props.merchantID}
            handleMerchantIDChange={props.handleMerchantIDChange}
          />
        </Layout.Section>

        <Layout.Section oneThird>
          <MasterTagID
            updateShareASaleTag={props.updateShareASaleTag}
            createPrivateMetafield={props.createPrivateMetafield}
            masterTagShopifyID={props.masterTagShopifyID}
            refetchMasterTagShopifyID={props.refetchMasterTagShopifyID}
            masterTagID={props.masterTagID}
            refetchMasterTagID={props.refetchMasterTagID}
            data2={props.data2}
            refetch2={props.refetch2}
            masterTID={props.masterTID}
            handleMasterTagIDChange={props.handleMasterTagIDChange}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;
