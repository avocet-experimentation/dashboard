import { Environment } from '@avocet/core';
import { Table, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { lastUpdated, formatDate } from '#/lib/timeFunctions';
import { ServicesContext } from '#/services/ServiceContext';
import { Switch } from '../../ui/switch';
import { Tooltip } from '../../ui/tooltip';
import EnvironmentManagementModal from '../management-form/EnvironmentManagementModal';
import { useMutation } from '@tanstack/react-query';
import request from 'graphql-request';
import { UPDATE_ENVIRONMENT } from '#/lib/environment-queries';

interface EnvironmentTableRowProps {
  environment: Environment;
  // updateEnvironment: (updated: Environment) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EnvironmentTableRow({
  environment,
  // updateEnvironment,
  // setIsLoading,
}: EnvironmentTableRowProps) {
  const [env, setEnv] = useState<Environment>(environment);
  // see https://tanstack.com/query/latest/docs/framework/react/guides/mutations
  const { mutate, isPending, isSuccess, data } = useMutation({
    mutationFn: async (checked: boolean) => {
      return request(
        import.meta.env.VITE_GRAPHQL_SERVICE_URL,
        UPDATE_ENVIRONMENT,
        {
          partialEntry: {
            id: environment.id,
            defaultEnabled: checked,
          },
        },
      );
    },
    onSuccess: (data, variables, context) => {
      console.log({ data });
      const updated = data.updateEnvironment;
      if (updated === null) return;
      setEnv(updated);
    },
  });

  const handleCheckedChange = (checked: boolean) => {
    mutate(checked);
  };

  return (
    <Table.Row>
      <Table.Cell color="black" textDecor="none">
        <EnvironmentManagementModal environment={env} />
      </Table.Cell>
      <Table.Cell key={env.name}>
        <Switch
          checked={env.defaultEnabled}
          onCheckedChange={(e) => handleCheckedChange(e.checked)}
          disabled={isPending}
        />
      </Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(env.updatedAt))}
        >
          <Text width="fit-content">{lastUpdated(Number(env.updatedAt))}</Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
