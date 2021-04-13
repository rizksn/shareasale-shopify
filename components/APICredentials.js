import React from "react";
import {
  Layout,
  Card,
  FormLayout,
  TextField,
  PageActions,
  InlineError,
} from "@shopify/polaris";

const APICredentials = (props) => {
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
              onChange={props.handleTokenChange}
              value={props.tokenValue}
            />
            <TextField
              label="API Secret"
              id="apiSecret"
              onChange={props.handleKeyChange}
              value={props.keyValue}
            />
          </FormLayout>

          <PageActions
            primaryAction={{
              content: "Save",
              loading: props.buttonState,
              onAction: () => {
                props.setButtonState(true);
                props.attemptAPIcall();
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
        <InlineError message={props.errorValue} fieldID="apiError" />
      </Layout>
    </Card>
  );
};

export default APICredentials;
