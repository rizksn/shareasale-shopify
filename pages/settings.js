import React, { useState, useCallback } from "react";
import { useMutation, useQuery } from "react-apollo";
import { Page, Layout, Card, Stack, Link } from "@shopify/polaris";
import APICenter from "../components/APICenter";

const Settings = () => {
  return (
    <Page title="ShareASale Shopify Tracker" narrowWidth>
      <Layout>
        <Layout.Section>
          <APICenter />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Settings;
