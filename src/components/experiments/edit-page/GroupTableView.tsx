import { COLORS } from '#/lib/constants';
import { Icon, Table } from '@chakra-ui/react';
import { EditableGenerals } from '#/components/helpers/EditableGenerals';
import { Square } from 'lucide-react';
import { useExperimentContext } from './ExperimentContext';

export default function GroupTableView() {
  const { experiment, useUpdateExperiment } = useExperimentContext();
  const { mutate } = useUpdateExperiment();
  return (
    <Table.Root stickyHeader interactive width="-moz-max-content">
      <Table.ColumnGroup>
        <Table.Column htmlWidth="25%" />
        <Table.Column htmlWidth="55%" />
        <Table.Column htmlWidth="10%" />
        <Table.Column htmlWidth="10%" />
      </Table.ColumnGroup>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>NAME</Table.ColumnHeader>
          <Table.ColumnHeader>TREATMENT</Table.ColumnHeader>
          <Table.ColumnHeader>SPLIT</Table.ColumnHeader>
          <Table.ColumnHeader>CYCLES</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {experiment.groups.map((group, idx) => (
          <Table.Row>
            <Table.Cell display="flex" dir="row" alignItems="center">
              <Icon color={COLORS[idx]} marginRight="2.5px">
                <Square />
              </Icon>
              <EditableGenerals
                defaultValue={group.name}
                inputType="text"
                onValueCommit={(e) => {
                  experiment.groups[idx].name = e.value;
                  mutate({ groups: experiment.groups });
                }}
              />
            </Table.Cell>
            <Table.Cell>{}</Table.Cell>
            <Table.Cell>
              <EditableGenerals
                defaultValue={String(group.proportion)}
                inputType="number"
                onValueCommit={(e) => {
                  experiment.groups[idx].proportion = Number(e.value);
                  mutate({ groups: experiment.groups });
                }}
              />
            </Table.Cell>
            <Table.Cell>
              <EditableGenerals
                defaultValue={String(group.cycles)}
                inputType="number"
                onValueCommit={(e) => {
                  experiment.groups[idx].cycles = Number(e.value);
                  mutate({ groups: experiment.groups });
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
