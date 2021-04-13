import React, { useState, useCallback } from "react";
import { useMutation, useQuery } from "react-apollo";
import { Page, Layout, Card, Stack, Link, Spinner } from "@shopify/polaris";
import APICenter from "../components/APICenter";
import StoreID from "../components/StoreID";
import Xtype from "../components/Xtype";
import gql from "graphql-tag";
const os = require("os");

const UPDATE_SHAREASLE_TAG = gql`
  mutation($id: ID!, $input: ScriptTagInput!) {
    scriptTagUpdate(id: $id, input: $input) {
      userErrors {
        field
        message
      }
    }
  }
`;

const Settings = () => {
  const [updateTrackingScript] = useMutation(UPDATE_SHAREASLE_TAG);
  const [merchantSettings, merchantSettingsUpdate] = useState({});
  const [settingsLoading, settingsLoadingSwitch] = useState(true);
  const [checkedSettings, checkedSettingsSwitch] = useState(false);

  const { loading: notReady, data: shopQuery } = useQuery(gql`
    query {
      shop {
        myshopifyDomain
      }
    }
  `);

  if (notReady || settingsLoading) {
    if (!notReady && !checkedSettings) {
      getSettings();
    }

    return (
      <Page>
        <Layout>
          <Spinner />
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="ShareASale Shopify Tracker" narrowWidth>
      <Layout>
        <Layout.Section>
          <APICenter
            shop={shopQuery.shop.myshopifyDomain}
            merchantSettings={merchantSettings}
          />
        </Layout.Section>
        <Layout.Section>
          <StoreID
            shop={shopQuery.shop.myshopifyDomain}
            merchantSettings={merchantSettings}
            merchantSettingsUpdate={merchantSettingsUpdate}
            updateTrackingScript={updateTrackingScript}
          />
          <Xtype
            shop={shopQuery.shop.myshopifyDomain}
            merchantSettings={merchantSettings}
            merchantSettingsUpdate={merchantSettingsUpdate}
            updateTrackingScript={updateTrackingScript}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );

  async function getSettings() {
    const results = await fetch(`https://${os.hostname()}/api/settings/`, {
      method: "POST",
      body: JSON.stringify({ shop: shopQuery.shop.myshopifyDomain }),
    });
    const resultsJSON = await results.json();
    checkedSettingsSwitch(true);
    merchantSettingsUpdate({
      merchantID: resultsJSON.merchantID,
      masterTagID: resultsJSON.masterTagID,
      trackingTagShopifyID: resultsJSON.trackingTagShopifyID,
      masterTagShopifyID: resultsJSON.masterTagShopifyID,
      storesConnectStoreID: resultsJSON.storesConnectStoreID,
      xtypeMode: resultsJSON.xtypeMode,
      xtypeValue: resultsJSON.xtypeValue,
      channelDeduplication: resultsJSON.channelDeduplication,
    });
    if (resultsJSON.merchantID) {
      settingsLoadingSwitch(false);
    }
  }
};

export default Settings;
