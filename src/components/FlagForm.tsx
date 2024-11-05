import { Field, Input, Stack } from "@chakra-ui/react";
import { FeatureFlag } from "@fflags/types";
import { useState } from "react";

export default function FlagManagementForm({ flag }: { flag?: FeatureFlag }) {
  // populate fields with the flag object if passed

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [environments, setEnvironments] = useState("");

  return (
    <form id="flag-management-form">
      <Stack gap="4">
        <Field label="Flag Name">
          <Input></Input>
        </Field>
      </Stack>
    </form>
  );
}
