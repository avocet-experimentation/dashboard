import { Flex, Tabs, Text } from "@chakra-ui/react";
import { FlagEnvironmentMapping } from "@estuary/types";
import { useState } from "react";
import FormModalTrigger from "../FormModal";
import { CirclePlus } from "lucide-react";
import RuleForm from "./RuleForm";

const ADD_RULL_FORM_ID = "add-rule-formn";

const EnvironmentTabs = ({
  environments,
  valueType,
  defaultValue,
  featureId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [envNames, setEnvNames] = useState<string[]>(Object.keys(environments));
  const [selectedTab, setSelectedTab] = useState<string | null>(
    `${envNames[0]}-tab`
  );

  return (
    <Tabs.Root
      value={selectedTab}
      margin="15px 0 0 0"
      variant={"plain"}
      onValueChange={(e) => setSelectedTab(e.value)}
    >
      <Tabs.List>
        {envNames.map((envName) => {
          const envContent = environments[envName];
          const rules = envContent["overrideRules"];
          return (
            <Tabs.Trigger
              defaultValue={`${envNames[0]}-tab`}
              value={`${envName}-tab`}
              key={`${envName}-tab`}
            >
              {envName} {rules.length}
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      <Tabs.ContentGroup>
        {envNames.map((envName) => {
          const envContent = environments[envName];
          const rules = envContent["overrideRules"];
          return (
            <Tabs.Content
              value={`${envName}-tab`}
              key={`${envName}-tab-content`}
              background="whitesmoke"
              padding="15px"
            >
              {!rules.length ? (
                "There are no rules for this environment yet"
              ) : (
                <></>
              )}
            </Tabs.Content>
          );
        })}
      </Tabs.ContentGroup>
      <Flex
        direction="row"
        justifyContent="space-between"
        border="1px solid grey"
        alignItems="center"
        padding="15px"
      >
        <Text>Add a new rule to {selectedTab.slice(0, -4)}</Text>
        <FormModalTrigger
          triggerButtonIcon={<CirclePlus />}
          triggerButtonText={"Add Rule"}
          title={`Add a new rule to ${selectedTab.slice(0, -4)}`}
          formId={ADD_RULL_FORM_ID}
          confirmButtonText={"Save"}
        >
          <RuleForm
            formId={ADD_RULL_FORM_ID}
            setIsLoading={setIsLoading}
            valueType={valueType}
            defaultValue={defaultValue}
            envName={selectedTab.slice(0, -4)}
            featureId={featureId}
          />
        </FormModalTrigger>
      </Flex>
    </Tabs.Root>
  );
};

export default EnvironmentTabs;
