import ExperimentService from '#/services/ExperimentService';
import FeatureService from '#/services/FeatureService';
import { useLocation, useRoute } from 'wouter';
import NotFound from '../NotFound';

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
  Button,
  Editable,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu';
import {
  Check,
  EllipsisVertical,
  FilePenLine,
  Link,
  Power,
  Trash2,
  X,
} from 'lucide-react';
import FormModalTrigger from '../FormModal';
import LinkFeatureForm from './LinkFeatureForm';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '../ui/accordion';

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

const formatGroups = (groups) => {
  return groups.map((group) => ({
    name: group.name,
    value: group.proportion * 1000,
  }));
};

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ExperimentPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editDesc, setEditDesc] = useState<boolean>(false);
  const [editHypo, setEditHypo] = useState<boolean>(false);
  const [experiment, setExperiment] = useState<FeatureFlag | null>(null);
  const [linkedFeatures, setLinkedFeatures] = useState([]);
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

    return () => handleGetExperiment();
  }, []);

  useEffect(() => {
    const handleGetLinkedFeatures = async () => {
      if (experiment.flagIds) {
        try {
          // todo:
          // get all flags and store them in a digestable format for this page
          const features = [];
          for (const flagId in experiment.flagIds) {
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

    return () => handleGetLinkedFeatures();
  }, [experiment]);

  const handleDeleteFeature = () => {
    // experimentService.deleteExperiment(experiment.id);
    // navigate("/experiments");
  };

  if (isLoading) return <></>;

  if (experiment) {
    return (
      <Stack gap={4} padding="25px" overflowY="scroll">
        <Flex justifyContent="space-between">
          <Heading size="3xl">{experiment.name}</Heading>
          <HStack>
            <Button>
              <Power />
              Start Experiment
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
                defaultValue={experiment.description}
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
                defaultValue={experiment.hypothesis}
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
                    {data.map((entry, index) => (
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
                  Linked Features ({experiment.flagIds.length})
                </Heading>
                <FormModalTrigger
                  triggerButtonIcon={<Link />}
                  triggerButtonText={'Link Feature Flag'}
                  title={`Link Feature to ${experiment.name}`}
                  formId={LINK_FEATURE_FORM}
                  confirmButtonText={'Link'}
                >
                  <LinkFeatureForm
                    formId={LINK_FEATURE_FORM}
                    setIsLoading={undefined}
                  />
                </FormModalTrigger>
              </Flex>
              <AccordionRoot variant="enclosed" collapsible>
                {linkedFeatures.map((feature) => (
                  <AccordionItem>
                    <AccordionItemTrigger>{feature.name}</AccordionItemTrigger>
                    <AccordionItemContent></AccordionItemContent>
                  </AccordionItem>
                ))}
              </AccordionRoot>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    );
  } else {
    return <NotFound componentName={'experiment'} />;
  }
};

export default ExperimentPage;
