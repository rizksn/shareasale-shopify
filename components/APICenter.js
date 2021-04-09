import React, { useEffect, useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Link,
  Spinner,
  FormLayout,
  TextField,
  PageActions,
  InlineError,
  SettingToggle,
  TextStyle,
  Icon,
} from "@shopify/polaris";
import { QuestionMarkMinor } from "@shopify/polaris-icons";
import { useMutation, useQuery } from "react-apollo";
import gql from "graphql-tag";
const os = require("os");

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
const DELETE_WEBHOOK_SUBSCRIPTION = gql`
  mutation webhookSubscriptionDelete($id: ID!) {
    webhookSubscriptionDelete(id: $id) {
      userErrors {
        field
        message
      }
      deletedWebhookSubscriptionId
    }
  }
`;

const APICenter = () => {
  const { loading: notReady, data: shopQuery } = useQuery(gql`
    query {
      shop {
        myshopifyDomain
      }
    }
  `);
  const [createWebhookSubscription] = useMutation(CREATE_WEBHOOK_SUBSCRIPTION);
  const [deleteWebhookSubscription] = useMutation(DELETE_WEBHOOK_SUBSCRIPTION);
  // API credential states
  const [tokenValue, setTokenValue] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [errorValue, setErrorValue] = useState("");
  const [buttonState, setButtonState] = useState(false);
  const [apiEnabled, apiEnabledChange] = useState("");
  const [settingsLoading, settingsLoadingChange] = useState(true);
  const handleTokenChange = useCallback(
    (newValue) => setTokenValue(newValue),
    []
  );
  const handleKeyChange = useCallback((newValue) => setKeyValue(newValue), []);
  const handleErrorChange = useCallback(
    (newValue) => setErrorValue(newValue),
    []
  );
  const [checkedCredentials, checkedCredentialsSwitch] = useState(false);
  const [checkedSettings, checkedSettingsSwitch] = useState(false);
  // Reconciliation states
  const [voidsButtonSpinner, setVoidsButtonSpinner] = useState(false);
  const [voidsSubscriptionID, setVoidsSubscriptionID] = useState("");
  const [voidsActive, setVoidsActive] = useState(false);

  async function voidsButtonClicked() {
    setVoidsButtonSpinner(true);
    if (!voidsActive) {
      let subscriptionID = await addWebhook("ORDERS_UPDATED");
      if (subscriptionID) {
        setVoidsActive((voidsActive) => !voidsActive), [];
      } else {
        alert("Something went wrong");
      }
      // Open the settings check again so that the webhook subscription ID
      // can be pulled again
      checkedSettingsSwitch(false);
    } else if (voidsActive) {
      let subscriptionID = await deleteWebhook("ORDERS_UPDATED");

      if (subscriptionID) {
        setVoidsActive((voidsActive) => !voidsActive), [];
      } else {
        alert("Something went wrong");
      }
    }
    setVoidsButtonSpinner(false);
  }

  const voidsContentStatus = voidsActive ? "Disable" : "Enable";
  const voidsTextStatus = voidsActive ? "enabled" : "disabled";
  // Recurring commission states
  const [recurringButtonSpinner, setRecurringButtonSpinner] = useState(false);
  const [recurringSubscriptionID, setRecurringSubscriptionID] = useState("");
  const [recurringActive, setRecurringActive] = useState(false);

  async function recurringButtonClicked() {
    setRecurringButtonSpinner(true);
    if (!recurringActive) {
      let subscriptionID = await addWebhook("ORDERS_CREATE");
      if (subscriptionID) {
        setRecurringActive((recurringActive) => !recurringActive), [];
      } else {
        alert("Something went wrong");
      }
      // Open the settings check again so that the webhook subscription ID
      // can be pulled again
      checkedSettingsSwitch(false);
    } else if (recurringActive) {
      let subscriptionID = await deleteWebhook("ORDERS_CREATE");

      if (subscriptionID) {
        setRecurringActive((recurringActive) => !recurringActive), [];
      } else {
        alert("Something went wrong");
      }
    }
    setRecurringButtonSpinner(false);
  }
  const recurringContentStatus = recurringActive ? "Disable" : "Enable";
  const recurringTextStatus = recurringActive ? "enabled" : "disabled";
  // Return spinner while we await the shop name to be returned
  // Once it's returned, we can then use the current DB credentials
  // to check if they are correct
  if (notReady) {
    return (
      <Page>
        <Layout>
          <Spinner />
        </Layout>
      </Page>
    );
  }
  // Look to see if credentials have already been tested
  // to prevent superfluous calls on re-render
  if (!checkedCredentials) {
    let prefetchBody = {
      shop: shopQuery.shop.myshopifyDomain,
      apiToken: null,
      apiSecret: null,
      preCheck: true,
    };
    fetch(`https://${os.hostname()}/api/validate/`, {
      method: "POST",
      body: JSON.stringify(prefetchBody),
    })
      .then((x) => {
        return x.text();
      })
      .then((x) => {
        checkedCredentialsSwitch(true);
        if (x.includes("Transaction Not Found")) {
          apiEnabledChange(true);
        } else if (x.includes("Error Code 4004")) {
          alert("Stop that!");
        } else {
          apiEnabledChange(false);
        }
      });
  }
  // While we wait for the response from ShareASale, return a spinner
  if (apiEnabled === "") {
    return (
      <Page>
        <Layout>
          <Spinner />
        </Layout>
      </Page>
    );
  }
  // If we don't have the correct credentials, then show config page
  if (!apiEnabled) {
    return (
      <Card sectioned>
        <Layout>
          <Layout.AnnotatedSection
            title="API Credentials"
            description="Adding your API credentials will allow you to automate certain tasks such as voiding commissions on refunded orders. Click the API Center button to get your credentials."
          >
            <FormLayout>
              <TextField
                label="API Token"
                id="apiToken"
                onChange={handleTokenChange}
                value={tokenValue}
              />
              <TextField
                label="API Secret"
                id="apiSecret"
                onChange={handleKeyChange}
                value={keyValue}
              />
            </FormLayout>

            <PageActions
              primaryAction={{
                content: "Save",
                loading: buttonState,
                onAction: () => {
                  setButtonState(true);
                  attemptAPIcall();
                },
              }}
              secondaryActions={[
                {
                  content: "ShareASale API Center",
                  destructive: false,
                  external: true,
                  url: "https://account.shareasale.com/m-apiips.cfm",
                },
              ]}
            />
          </Layout.AnnotatedSection>
          <InlineError message={errorValue} fieldID="apiError" />
        </Layout>
      </Card>
    );
  }
  // If we currently have the correct credentials in the DB,
  // display the options for the API. First, check to see which
  // API options are enabled
  if (!checkedSettings) {
    fetch(`https://${os.hostname()}/api/settings/`, {
      method: "POST",
      body: JSON.stringify({ shop: shopQuery.shop.myshopifyDomain }),
    })
      .then((x) => {
        return x.json();
      })
      .then((x) => {
        checkedSettingsSwitch(true);
        settingsLoadingChange(false);
        if (x.recurringCommissionsWebhookID) {
          setRecurringActive(true);
          setRecurringSubscriptionID(x.recurringCommissionsWebhookID);
        }
        if (x.autoReconciliationWebhookID) {
          setVoidsActive(true);
          setVoidsSubscriptionID(x.autoReconciliationWebhookID);
        }
      });
  }

  if (settingsLoading) {
    return (
      <Page>
        <Layout>
          <Spinner />
        </Layout>
      </Page>
    );
  }

  if (apiEnabled) {
    return (
      <>
        <Page>
          <Layout>
            <Layout.Section>
              <SettingToggle
                action={{
                  content: voidsContentStatus,
                  onAction: voidsButtonClicked,
                  loading: voidsButtonSpinner,
                }}
                enabled={voidsActive}
              >
                Automatic commission voiding is{" "}
                <TextStyle variation="strong">{voidsTextStatus}</TextStyle>.
              </SettingToggle>
            </Layout.Section>
            <Layout.Section>
              <SettingToggle
                action={{
                  content: recurringContentStatus,
                  onAction: recurringButtonClicked,
                  loading: recurringButtonSpinner,
                }}
                enabled={recurringActive}
              >
                Recurring commissions for subscription renewals is{" "}
                <TextStyle variation="strong">{recurringTextStatus}</TextStyle>.
              </SettingToggle>
            </Layout.Section>
          </Layout>
        </Page>
      </>
    );
  }

  function attemptAPIcall() {
    let token = document.getElementById("apiToken").value.trim(),
      secret = document.getElementById("apiSecret").value.trim(),
      fetchBody = {
        shop: shopQuery.shop.myshopifyDomain,
        apiToken: token,
        apiSecret: secret,
      };
    fetch(`https://${os.hostname()}/api/validate/`, {
      method: "POST",
      body: JSON.stringify(fetchBody),
    })
      .then((x) => {
        return x.text();
      })
      .then((x) => {
        setButtonState(false);
        if (!x.includes("Error Code")) {
          // If there wasn't an error code, store the credentials in the DB
          let editBody = {
            shop: shopQuery.shop.myshopifyDomain,
            shareasaleAPIToken: token,
            shareasaleAPISecret: secret,
          };
          fetch(`https://${os.hostname()}/api/editshop/`, {
            method: "POST",
            body: JSON.stringify(editBody),
          }).then(() => {
            checkedCredentialsSwitch(false);
          });
        }
        if (x.includes("Error Code 4001")) {
          handleErrorChange("API Token field is blank");
        }
        if (x.includes("Error Code 4002")) {
          handleErrorChange(
            'On the ShareASale API page, change "Require IP address match for all API Calls" to "Require IP address match only for version 1.1 and lower"'
          );
        }
        if (x.includes("Error Code 4003")) {
          handleErrorChange(
            "The API Token doesn't match your ShareASale Merchant ID"
          );
        }
        if (x.includes("Error Code 4031")) {
          handleErrorChange(
            "The API Token is correct, but the API Secret is incorrect"
          );
        }
      });
  }

  async function addWebhook(topic) {
    const subscription = await createWebhookSubscription({
      variables: {
        topic: topic,
        webhookSubscription: {
          callbackUrl: `https://${os.hostname()}/api/webhooks/`,
          format: "JSON",
        },
      },
    });

    if (subscription.data.webhookSubscriptionCreate.webhookSubscription) {
      let addSubscriptionBody = {
        shop: shopQuery.shop.myshopifyDomain,
      };
      if (topic === "ORDERS_UPDATED") {
        addSubscriptionBody.autoReconciliationWebhookID =
          subscription.data.webhookSubscriptionCreate.webhookSubscription.id;
      }
      if (topic === "ORDERS_CREATE") {
        addSubscriptionBody.recurringCommissionsWebhookID =
          subscription.data.webhookSubscriptionCreate.webhookSubscription.id;
      }
      await editShop(addSubscriptionBody);
    }
    return subscription.data.webhookSubscriptionCreate.webhookSubscription?.id;
  }

  async function deleteWebhook(topic) {
    let deleteSubscriptionBody = {
        shop: shopQuery.shop.myshopifyDomain,
      },
      webhookOptions = {};

    if (topic === "ORDERS_UPDATED") {
      deleteSubscriptionBody.autoReconciliationWebhookID = "delete";
      webhookOptions.id = voidsSubscriptionID;
    }
    if (topic === "ORDERS_CREATE") {
      deleteSubscriptionBody.recurringCommissionsWebhookID = "delete";
      webhookOptions.id = recurringSubscriptionID;
    }

    const subscription = await deleteWebhookSubscription({
      variables: webhookOptions,
    });

    if (
      subscription.data.webhookSubscriptionDelete.deletedWebhookSubscriptionId
    ) {
      await editShop(deleteSubscriptionBody);
    }
    return subscription.data.webhookSubscriptionDelete
      .deletedWebhookSubscriptionId;
  }
  /**
   * Adds information to the shop listing in Mongo
   * @param {object} body Input for the shop edit
   */
  async function editShop(body) {
    const result = await fetch(`https://${os.hostname()}/api/editshop/`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return result;
  }
};

export default APICenter;
