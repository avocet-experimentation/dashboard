import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '#/components/ui/accordion';
import { Tag } from '#/components/ui/tag';
import { Tooltip } from '#/components/ui/tooltip';
import {
  AbsoluteCenter,
  Box,
  Button,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import { Experiment, ExperimentDraft, FeatureFlag } from '@avocet/core';
import {
  ALargeSmall,
  Check,
  Hash,
  ToggleLeft,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { useMemo } from 'react';
import { useExperimentContext } from './ExperimentContext';

export function LinkedFlagInfo({ flag }: { flag: FeatureFlag }) {
  const { useExperiment, useUpdateExperiment } = useExperimentContext();
  const { data: experiment } = useExperiment();
  const { mutate } = useUpdateExperiment();
  const renderValueTypeIcon = useMemo(() => {
    switch (flag.value.type) {
      case 'string':
        return <ALargeSmall />;
      case 'number':
        return <Hash />;
      case 'boolean':
        return <ToggleLeft />;
      // default:
      //   return <></>;
    }
  }, [flag.value.type]);

  if (!experiment) return <></>;

  const { icon, colorPalette, tooltip, text } =
    experiment.environmentName in flag.environmentNames
      ? {
          colorPalette: 'green',
          icon: <Check />,
          text: 'Live',
          tooltip: `This flag is enabled in the '${experiment.environmentName}' environment.`,
        }
      : {
          colorPalette: 'red',
          icon: <TriangleAlert />,
          text: 'Disabled',
          tooltip: `This flag is disabled in the '${experiment.environmentName}' environment.`,
        };

  const removeFlag = (flagId: string) => {
    console.log(`Clicked remove at ${String(Date.now()).slice(-5)}`);
    const updated = ExperimentDraft.removeFlag(experiment, flagId);
    mutate(updated);
  };

  console.log(`Rendering at ${String(Date.now()).slice(-5)}`);
  return (
    <AccordionItem key={flag.id} value={flag.name}>
      <Box position="relative" id="flag-accordion-trigger">
        <AccordionItemTrigger id={flag.id} indicatorPlacement="start">
          <Stack direction="row" gap={4}>
            <Text>{flag.name}</Text>
            <Tag size="md" variant="outline" startElement={renderValueTypeIcon}>
              {flag.value.type}
            </Tag>
            <Tooltip showArrow openDelay={50} content={tooltip}>
              <Tag size="md" startElement={icon} colorPalette={colorPalette}>
                {text}
              </Tag>
            </Tooltip>
          </Stack>
        </AccordionItemTrigger>
        {/* TODO: match the styling and look of this button with other inline elements */}
        <AbsoluteCenter axis="vertical" insetEnd="15px">
          <Button
            variant="solid"
            // colorPalette="red"
            background={'red'}
            padding="4px"
            size="sm"
            onClick={() => removeFlag(flag.id)}
          >
            <Trash2 />
          </Button>
        </AbsoluteCenter>
      </Box>
      <AccordionItemContent>
        <FlagStateTable flag={flag} />
      </AccordionItemContent>
    </AccordionItem>
  );
}
/**
 * A table of all the flag states for a specific flag in an experiment
 */
function FlagStateTable({ flag }: { flag: FeatureFlag }) {
  const { useExperiment } = useExperimentContext();
  const { data } = useExperiment();

  if (!data) return <></>;
  const experiment: Experiment = data;

  return (
    <Stack gap={2}>
      <Text>Flag Values</Text>
      <Table.Root width="250px" size="sm" variant="outline" showColumnBorder>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>TREATMENT</Table.ColumnHeader>
            <Table.ColumnHeader>VALUE</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(experiment.definedTreatments).map((treatment) => {
            const flagState = treatment.flagStates.find(
              (state) => state.id === flag.id,
            );
            if (!flagState) {
              // TODO: handle this error better
              return <></>;
            }
            return (
              <Table.Row key={treatment.id}>
                <Table.Cell>{treatment.name}</Table.Cell>
                <Table.Cell>{String(flagState.value)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
