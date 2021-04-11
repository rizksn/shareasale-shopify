import React, { useState, useCallback } from "react";
import { Page, Layout, Spinner } from "@shopify/polaris";
import { useMutation, useQuery } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

import Start from "../components/Start";
import Dashboard from "../components/Dashboard";

const Index = () => {
  const [merchantSettings, merchantSettingsUpdate] = useState({});
  const [settingsLoading, settingsLoadingSwitch] = useState(true);
  const [checkedSettings, checkedSettingsSwitch] = useState(false);
  const [trackingInstalled, trackingInstalledSwitch] = useState(false);
  const handleMerchantIDTextFieldChange = useCallback(
    (newValue) => setTextFieldMerchantID(newValue),
    []
  );

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

  if (!trackingInstalled) {
    return (
      <Start
        shop={shopQuery.shop.myshopifyDomain}
        handleMerchantIDTextFieldChange={handleMerchantIDTextFieldChange}
      />
    );
  } else {
    return (
      <Dashboard
        shop={shopQuery.shop.myshopifyDomain}
        merchantSettings={merchantSettings}
        handleMerchantIDTextFieldChange={handleMerchantIDTextFieldChange}
      />
    );
  }

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
      trackingInstalledSwitch(true);
    }
    settingsLoadingSwitch(false);
  }
};

export default Index;
