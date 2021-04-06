import React from "react";
import { Page, Layout, Card, Link } from "@shopify/polaris";
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
            masterTagID={props.masterTagID}
            masterTagShopID={props.masterTagShopID}
            masterTID={props.masterTID}
            handleMasterTagIDChange={props.handleMasterTagIDChange}
            masterTagShopifyID={props.masterTagShopifyID}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Dashboard;
