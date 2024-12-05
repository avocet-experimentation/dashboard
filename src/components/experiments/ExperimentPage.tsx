import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LabelProps as RechartsLabelProps,
} from 'recharts';
import {
  Box,
  Editable,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react';
import {
  ALargeSmall,
  Check,
  EllipsisVertical,
  FilePenLine,
  Hash,
  Link,
  OctagonX,
  Play,
  Power,
  ToggleLeft,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { Experiment, ExperimentGroup, FeatureFlag } from '@estuary/types';
import FeatureService from '#/services/FeatureService';
import ExperimentService from '#/services/ExperimentService';
import NotFound from '../NotFound';

import {
  MenuContent, MenuItem, MenuRoot, MenuTrigger,
} from '../ui/menu';
import FormModal from '../forms/FormModal';
import LinkFeatureForm from './LinkFeatureForm';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '../ui/accordion';
import { Button } from '../ui/button';
import { Tag } from '../ui/tag';
import { Tooltip as ChakraTooltip } from '../ui/tooltip';

interface CustomLabelProps extends RechartsLabelProps {
  innerRadius: number; // The inner radius of the pie slice
  outerRadius: number; // The outer radius of the pie slice
  cx: number; // The x-coordinate of the center of the chart
  cy: number; // The y-coordinate of the center of the chart
  midAngle: number; // The angle (in degrees) at the middle of the pie slice
  percent: number; // The percentage of the pie slice relative to the total
}

const experimentService = new ExperimentService();
const featureService = new FeatureService();

const LINK_FEATURE_FORM = 'link-feature-form';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const formatGroups = (groups) =>
  groups.map((group) => ({
    name: group.name,
    value: group.proportion * 1000,
  }));

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

const flagTagProperties = (
  expEnvironment: string,
  flagEnvironments: string[],
) => {
  const environmentEnabled = Object.keys(flagEnvironments).includes(expEnvironment);
  const icon = environmentEnabled ? <Play /> : <TriangleAlert />;
  const text = environmentEnabled ? 'Live' : 'Disabled';
  const colorPalette = environmentEnabled ? 'green' : 'red';
  const tooltip = environmentEnabled
    ? `This feature has the ${expEnvironment} environment enabled.`
    : `The ${expEnvironment} environment is disabled for this feature, so the experiment is not active`;
  return {
    icon,
    text,
    colorPalette,
    tooltip,
  };
};

const experimentButtonProperties = (expStatus: string, expId: string) => {
  const active = expStatus === 'active';
  const icon = active ? <OctagonX /> : <Power />;
  const text = active ? 'Stop Experiment' : 'Start Experiment';
  const colorPalette = active ? 'red' : 'green';
  const onClick = active
    ? () => {}
    : () => experimentService.startExperiment(expId);
  return {
    icon,
    text,
    colorPalette,
    onClick,
  };
};

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function ExperimentPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [editHypo, setEditHypo] = useState<boolean>(false);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [linkedFeatures, setLinkedFeatures] = useState<Partial<FeatureFlag>[]>(
    [],
  );
  const [match, params] = useRoute('/experiments/:id');
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleGetExperiment = async () => {
      if (params) {
        try {
          const response = await experimentService.getExperiment(params.id);
          if (response.ok) {
            setExperiment(response.body);
          }
        } catch (error) {
          console.log(error);
        }
      }
      setIsLoading(false);
    };

    handleGetExperiment();
  }, []);

  useEffect(() => {
    const handleGetLinkedFeatures = async () => {
      if (experiment) {
        try {
          const features: Partial<FeatureFlag>[] = [];
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

  const handleDeleteFeature = () => {
    // experimentService.deleteExperiment(experiment.id);
    // navigate("/experiments");
  };

  if (isLoading) return <></>;

  if (experiment) {
    const expButtonProps = experimentButtonProperties(
      experiment.status,
      experiment.id,
    );
    return (
      <Stack gap={4} padding="25px" overflowY="scroll">
        <Flex justifyContent="space-between">
          <Heading size="3xl">{experiment.name}</Heading>
          <HStack>
            <Button
              variant="solid"
              colorPalette={expButtonProps.colorPalette}
              onClick={expButtonProps.onClick}
            >
              {expButtonProps.icon}
              {expButtonProps.text}
            </Button>
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton size="md">
                  <EllipsisVertical color="black" />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  value="delete"
                  valueText="Delete"
                  cursor="pointer"
                  color="fg.error"
                  _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  onClick={handleDeleteFeature}
                >
                  <Trash2 />
                  <Box flex="1">Delete</Box>
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </HStack>
        </Flex>
        <Box>
          <Heading size="xl" marginBottom="15px">
            Overview
          </Heading>
          <Stack gap={4}>
            <Stack padding="15px" bg="white" borderRadius="5px">
              <HStack gap={2.5}>
                <Heading size="lg">Description</Heading>
                <Icon
                  size="sm"
                  cursor="pointer"
                  onClick={() => setEditDesc(true)}
                >
                  <FilePenLine color="black" />
                </Icon>
              </HStack>
              <Editable.Root
                defaultValue={experiment.description || undefined}
                edit={editDesc}
                activationMode="focus"
                onBlur={() => {
                  // setEditDesc(false);
                }}
              >
                <Editable.Preview
                  minH="48px"
                  alignItems="flex-start"
                  width="full"
                />
                <Editable.Textarea />
                <Editable.Control>
                  <Editable.CancelTrigger asChild>
                    <IconButton variant="outline" size="xs">
                      <X />
                    </IconButton>
                  </Editable.CancelTrigger>
                  <Editable.SubmitTrigger asChild>
                    <IconButton variant="outline" size="xs">
                      <Check />
                    </IconButton>
                  </Editable.SubmitTrigger>
                </Editable.Control>
              </Editable.Root>
            </Stack>
            <Stack padding="15px" bg="white" borderRadius="5px">
              <HStack gap={2.5}>
                <Heading size="lg">Hypothesis</Heading>
                <Icon
                  size="sm"
                  cursor="pointer"
                  onClick={() => setEditHypo(true)}
                >
                  <FilePenLine color="black" />
                </Icon>
              </HStack>
              <Editable.Root
                defaultValue={experiment.hypothesis || undefined}
                edit={editHypo}
                activationMode="focus"
                onBlur={() => {
                  // setEditDesc(false);
                }}
              >
                <Editable.Preview
                  minH="48px"
                  alignItems="flex-start"
                  width="full"
                />
                <Editable.Textarea />
                <Editable.Control>
                  <Editable.CancelTrigger asChild>
                    <IconButton variant="outline" size="xs">
                      <X />
                    </IconButton>
                  </Editable.CancelTrigger>
                  <Editable.SubmitTrigger asChild>
                    <IconButton variant="outline" size="xs">
                      <Check />
                    </IconButton>
                  </Editable.SubmitTrigger>
                </Editable.Control>
              </Editable.Root>
            </Stack>
          </Stack>
        </Box>
        <Box>
          <Heading size="xl" marginBottom="15px">
            Implementation
          </Heading>
          <Stack gap={4}>
            <Stack padding="15px" bg="white" borderRadius="5px">
              <Heading size="lg">Variation Groups</Heading>
              <ResponsiveContainer minWidth="200px" minHeight="200px">
                <PieChart width={400} height={400}>
                  <Pie
                    data={experiment.groups}
                    dataKey="proportion"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {data.map((_, index) => (
                      <Cell
                        cursor="help"
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Stack>
            <Stack padding="15px" bg="white" borderRadius="5px">
              <Flex justifyContent="space-between">
                <Heading size="lg">
                  Linked Features (
                  {experiment.flagIds.length}
                  )
                </Heading>
                <FormModal
                  triggerButtonIcon={<Link />}
                  triggerButtonText="Link Feature Flag"
                  title={`Link Feature to ${experiment.name}`}
                  formId={LINK_FEATURE_FORM}
                  confirmButtonText="Link"
                >
                  <LinkFeatureForm
                    formId={LINK_FEATURE_FORM}
                    setIsLoading={undefined}
                  />
                </FormModal>
              </Flex>
              <AccordionRoot variant="enclosed" multiple>
                {linkedFeatures.map((feature) => {
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
                            startElement={renderValueTypeIcon(
                              feature.valueType,
                            )}
                          >
                            {feature.valueType}
                          </Tag>
                          <ChakraTooltip
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
                          </ChakraTooltip>
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
                              {experiment.groups.map(
                                (group: ExperimentGroup) => {
                                  const sequence = group.sequence[0];
                                  const servedValue = experiment.definedTreatments[
                                    sequence
                                  ].flagStates.find(
                                    (treatmentFeature) =>
                                      treatmentFeature.id === feature.id,
                                  ).value;
                                  return (
                                    <Table.Row key={group.id}>
                                      <Table.Cell>{group.name}</Table.Cell>
                                      <Table.Cell>{servedValue}</Table.Cell>
                                    </Table.Row>
                                  );
                                },
                              )}
                            </Table.Body>
                          </Table.Root>
                        </Stack>
                      </AccordionItemContent>
                    </AccordionItem>
                  );
                })}
              </AccordionRoot>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    );
  }
  return <NotFound componentName="experiment" />;
}

export default ExperimentPage;
