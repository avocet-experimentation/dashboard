// components
import { Table, Text } from '@chakra-ui/react';
import { Switch } from '../ui/switch';
import { Tooltip } from '../ui/tooltip';

// library
import { lastUpdated, formatDate } from '#/lib/timeFunctions';

// types
import { Environment } from '@estuary/types';

// util
import { Link } from 'wouter';
import { useEffect, useState } from 'react';
import EnvironmentService from '#/services/EnvironmentService';
import EnvironmentManagementForm from './EnvironmentManagementForm';
import FormModalTrigger from '../FormModal';
import { CirclePlus } from 'lucide-react';
import EnvironmentManagementModal from './EnvironmentManagementModal';

export interface EnvironmentTableProps {
  environments: Environment[];
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  updateEnvironment: (updated: Environment) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // handleFormSubmitSuccess: (environment: Environment, updated: boolean) => void;
}
/**
 * Table listing all Environments
 */
export default function EnvironmentTable({
  environments,
  setEnvironments,
  updateEnvironment,
  isLoading,
  setIsLoading,
  // handleFormSubmitSuccess,
}: EnvironmentTableProps) {
  const environmentService = new EnvironmentService();

  // console.table(environments);

  return (
    <>
      {environments.length && (
        <Table.Root className="table">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Enabled by Default</Table.ColumnHeader>
              <Table.ColumnHeader>Last Updated</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {environments.map((env: Environment) => (
              <EnvironmentTableRow
                key={env.id}
                environment={env}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setEnvironments={setEnvironments}
                updateEnvironment={updateEnvironment}
                environmentService={environmentService}
              />
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
}

interface EnvironmentTableRowProps {
  environment: Environment;
  setEnvironments: React.Dispatch<React.SetStateAction<Environment[]>>;
  updateEnvironment: (updated: Environment) => void;
  // todo: make services hook and replace this
  environmentService: EnvironmentService;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function EnvironmentTableRow({
  environment,
  setEnvironments,
  updateEnvironment,
  environmentService,
  isLoading,
  setIsLoading,
}: EnvironmentTableRowProps) {
  const handleCheckedChange = (checked: boolean) => {
    environmentService.updateEnvironment(environment.id, {
      defaultEnabled: checked,
    });

    updateEnvironment({ ...environment, defaultEnabled: checked });
  };

  return (
    <Table.Row>
      <Table.Cell color="black" textDecor="none">
        <EnvironmentManagementModal
          setIsLoading={setIsLoading}
          environment={environment}
          setEnvironments={setEnvironments}
          updateEnvironment={updateEnvironment}
        />
      </Table.Cell>
      <Table.Cell key={environment.name}>
        <Switch
          checked={environment.defaultEnabled}
          onCheckedChange={(e) => handleCheckedChange(e.checked)}
        />
      </Table.Cell>
      <Table.Cell>
        <Tooltip
          showArrow
          openDelay={50}
          content={formatDate(Number(environment.updatedAt))}
        >
          <Text width="fit-content">
            {lastUpdated(Number(environment.updatedAt))}
          </Text>
        </Tooltip>
      </Table.Cell>
    </Table.Row>
  );
}
