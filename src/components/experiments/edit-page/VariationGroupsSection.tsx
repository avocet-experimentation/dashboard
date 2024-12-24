import { COLORS, RADIAN } from '#/lib/constants';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { ExperimentDraft } from '@avocet/core';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LabelProps as RechartsLabelProps,
} from 'recharts';

interface CustomLabelProps extends RechartsLabelProps {
  innerRadius: number; // The inner radius of the pie slice
  outerRadius: number; // The outer radius of the pie slice
  cx: number; // The x-coordinate of the center of the chart
  cy: number; // The y-coordinate of the center of the chart
  midAngle: number; // The angle (in degrees) at the middle of the pie slice
  percent: number; // The percentage of the pie slice relative to the total
}

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

export default function VariationGroups({
  experiment,
}: {
  experiment: ExperimentDraft;
}) {
  return (
    <Stack padding="15px" bg="white" borderRadius="5px">
      <Heading size="lg">Variation Groups</Heading>
      <Box width="50%">
        <ResponsiveContainer minWidth="200px" minHeight="200px">
          <PieChart width={400} height={400}>
            <Pie
              data={experiment.groups}
              dataKey="proportion"
              nameKey="name"
              cx="15%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
            >
              {COLORS.map((color, index) => (
                <Cell cursor="help" key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Legend layout="vertical" align="center" verticalAlign="middle" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Stack>
  );
}
