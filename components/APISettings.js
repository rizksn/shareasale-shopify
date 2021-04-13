import React, { useState, useCallback } from "react";
import {
  Card,
  SettingToggle,
  Button,
  Stack,
  TextStyle,
  Collapsible,
  TextContainer,
} from "@shopify/polaris";
import { QuestionMarkMajor } from "@shopify/polaris-icons";

const APISettings = (props) => {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const [open2, setOpen2] = useState(false);
  const handleToggle2 = useCallback(() => setOpen2((open2) => !open2), []);

  return (
    <>
      <Card>
        <SettingToggle
          action={{
            content: props.voidsContentStatus,
            onAction: props.voidsButtonClicked,
            loading: props.voidsButtonSpinner,
          }}
          enabled={props.voidsActive}
        >
          <Stack vertical>
            <Button
              icon={QuestionMarkMajor}
              onClick={handleToggle}
              ariaExpanded={open}
              ariaControls="basic-collapsible"
              outline
            ></Button>
            {/* <Icon source={QuestionMarkMajor} color="primary" /> */}
            <Collapsible
              open={open}
              id="basic-collapsible"
              transition={{ duration: "350ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <TextContainer>
                <p>
                  Automatic commission voiding will automatically edit/void
                  transactions in your ShareASale account, updating the
                  affiliate commission payout.
                </p>
                <br />
              </TextContainer>
            </Collapsible>
          </Stack>
          Automatic commission voiding is{" "}
          <TextStyle variation="strong">{props.voidsTextStatus}</TextStyle>
        </SettingToggle>
      </Card>
      <Card>
        <SettingToggle
          action={{
            content: props.recurringContentStatus,
            onAction: props.recurringButtonClicked,
            loading: props.recurringButtonSpinner,
          }}
          enabled={props.recurringActive}
        >
          <Stack vertical>
            <Button
              icon={QuestionMarkMajor}
              onClick={handleToggle2}
              ariaExpanded={open2}
              ariaControls="basic-collapsible2"
              outline
            ></Button>
            <Collapsible
              open={open2}
              id="basic-collapsible2"
              transition={{ duration: "350ms", timingFunction: "ease-in-out" }}
              expandOnPrint
            >
              <TextContainer>
                <p>
                  Recurring commissions will award affiliates a recurring
                  commission payment for subscription products. Recurring
                  subscription payments will automatically insert a sale
                  transaction in your ShareASale account, awarding affiliate
                  commissions.
                </p>
                <br />
              </TextContainer>
            </Collapsible>
          </Stack>
          Recurring commissions for subscription renewals is{" "}
          <TextStyle variation="strong">{props.recurringTextStatus}</TextStyle>.
        </SettingToggle>
      </Card>
    </>
  );
};

export default APISettings;
