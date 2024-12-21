import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '#/components/ui/accordion';
import { Tag } from '#/components/ui/tag';
import { Tooltip } from '#/components/ui/tooltip';
import { ServicesContext } from '#/services/ServiceContext';
import { Stack, Table, Text } from '@chakra-ui/react';
import {
  Experiment,
  ExperimentGroup,
  FeatureFlag,
  featureFlagSchema,
  parallelAsync,
} from '@avocet/core';
import {
  ALargeSmall,
  Hash,
  Play,
  ToggleLeft,
  TriangleAlert,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

// interface LinkedFeature {
//   id: string;
//   name: string;
//   environmentNames: Record<string, boolean>;
//   valueType: 'string' | 'number' | 'boolean';
// }

const flagTagProperties = (
  expEnvironment: string,
  flagEnvironments: Record<string, boolean>,
) => {
  const environmentEnabled =
    Object.keys(flagEnvironments).includes(expEnvironment);
  const icon = environmentEnabled ? <Play /> : <TriangleAlert />;
  const text = environmentEnabled ? 'Live' : 'Disabled';
  const colorPalette = environmentEnabled ? 'green' : 'red';
  const tooltip = environmentEnabled
    ? `This feature has the ${expEnvironment} environment enabled.`
    : `The ${expEnvironment} environment is disabled for this feature, so the experiment is not active`;
  return { icon, text, colorPalette, tooltip };
};

const renderValueTypeIcon = (valueType: string) => {
  switch (valueType) {
    case 'string':
      return <ALargeSmall />;
    case 'number':
      return <Hash />;
    case 'boolean':
      return <ToggleLeft />;
    default:
      return <></>;
  }
};

export default function LinkedFlagsSection({
  experiment,
}: {
  experiment: Experiment;
}) {
  const [linkedFlags, setLinkedFlags] = useState<FeatureFlag[]>([]);
  const services = useContext(ServicesContext);

  useEffect(() => {
    const handleGetLinkedFeatures = async () => {
      if (experiment) {
        try {
          const resolve = await parallelAsync(
            async (flagId: string) =>
              services.featureFlag
                .get(flagId)
                .then((res) => (res.ok ? res.body : res)),
            experiment.flagIds.map((id) => [id] as const),
          );

          const flags = resolve.filter(
            (res): res is FeatureFlag =>
              featureFlagSchema.safeParse(res).success,
          );
          setLinkedFlags(flags);

          // for (const flagId of experiment.flagIds) {
          //   const flag = await featureService.get(flagId);
          //   if (flag.ok) {
          //     features.push({
          //       id: flag.body.id,
          //       name: flag.body.name,
          //       environmentNames: flag.body.environmentNames,
          //       valueType: flag.body.value.type,
          //     });
          //   }
          // }
          // setLinkedFlags(features);
        } catch (error) {}
      }
    };

    handleGetLinkedFeatures();
  }, [experiment]);

  if (linkedFlags) {
    return (
      <AccordionRoot variant="enclosed" multiple>
        {linkedFlags.map((flag: FeatureFlag) => {
          console.log(flag.environmentNames);
          const statusTagProperties = flagTagProperties(
            experiment.environmentName,
            flag.environmentNames,
          );
          return (
            <AccordionItem key={flag.id} value={flag.name}>
              <AccordionItemTrigger id={flag.id}>
                <Stack direction="row" gap={4}>
                  <Text>{flag.name}</Text>
                  <Tag
                    size="md"
                    variant="outline"
                    startElement={renderValueTypeIcon(flag.value.type)}
                  >
                    {flag.value.type}
                  </Tag>
                  <Tooltip
                    showArrow
                    openDelay={50}
                    content={statusTagProperties.tooltip}
                  >
                    <Tag
                      size="md"
                      startElement={statusTagProperties.icon}
                      colorPalette={statusTagProperties.colorPalette}
                    >
                      {statusTagProperties.text}
                    </Tag>
                  </Tooltip>
                </Stack>
              </AccordionItemTrigger>
              <AccordionItemContent>
                <Stack gap={2}>
                  <Text>Feature Values</Text>
                  <Table.Root
                    width="250px"
                    size="sm"
                    variant="outline"
                    showColumnBorder
                  >
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>GROUP</Table.ColumnHeader>
                        <Table.ColumnHeader>SERVING</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {experiment.groups.map((group: ExperimentGroup) => {
                        const sequence = group.sequence[0];
                        const flagStates =
                          experiment.definedTreatments[sequence].flagStates;
                        const servedValue =
                          flagStates &&
                          flagStates.find(
                            (treatmentFeature) =>
                              treatmentFeature.id === flag.id,
                          )?.value;
                        return (
                          servedValue && (
                            <Table.Row key={group.id}>
                              <Table.Cell>{group.name}</Table.Cell>
                              <Table.Cell>{servedValue}</Table.Cell>
                            </Table.Row>
                          )
                        );
                      })}
                    </Table.Body>
                  </Table.Root>
                </Stack>
              </AccordionItemContent>
            </AccordionItem>
          );
        })}
      </AccordionRoot>
    );
  }

  return <></>;
}
