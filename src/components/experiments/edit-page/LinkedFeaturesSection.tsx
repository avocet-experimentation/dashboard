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
import { Experiment, ExperimentGroup, FeatureFlag } from '@estuary/types';
import {
  ALargeSmall,
  Hash,
  Play,
  ToggleLeft,
  TriangleAlert,
} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

interface LinkedFeature {
  id: string;
  name: string;
  environmentNames: Record<string, boolean>;
  valueType: 'string' | 'number' | 'boolean';
}

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

export default function LinkedFeatures({
  experiment,
}: {
  experiment: Experiment;
}) {
  const [linkedFeatures, setLinkedFeatures] = useState<LinkedFeature[]>([]);
  const { featureFlag: featureService } = useContext(ServicesContext);

  useEffect(() => {
    const handleGetLinkedFeatures = async () => {
      if (experiment) {
        try {
          const features: LinkedFeature[] = [];
          for (const flagId of experiment.flagIds) {
            const flag = await featureService.getFeature(flagId);
            if (flag.ok) {
              features.push({
                id: flag.body.id,
                name: flag.body.name,
                environmentNames: flag.body.environmentNames,
                valueType: flag.body.value.type,
              });
            }
          }
          setLinkedFeatures(features);
        } catch (error) {}
      }
    };

    handleGetLinkedFeatures();
  }, [experiment]);
  if (linkedFeatures) {
    return (
      <AccordionRoot variant="enclosed" multiple>
        {linkedFeatures.map((feature: LinkedFeature) => {
          console.log(feature.environmentNames);
          const statusTagProperties = flagTagProperties(
            experiment.environmentName,
            feature.environmentNames,
          );
          return (
            <AccordionItem key={feature.id} value={feature.name}>
              <AccordionItemTrigger id={feature.id}>
                <Stack direction="row" gap={4}>
                  <Text>{feature.name}</Text>
                  <Tag
                    size="md"
                    variant="outline"
                    startElement={renderValueTypeIcon(feature.valueType)}
                  >
                    {feature.valueType}
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
                              treatmentFeature.id === feature.id,
                          ).value;
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
