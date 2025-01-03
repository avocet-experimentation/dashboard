import { COLORS, RADIAN } from '#/lib/constants';
import { Experiment } from '@avocet/core';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
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

export default function GroupPieChart({
  experiment,
}: {
  experiment: Experiment;
}) {
  return (
    <ResponsiveContainer minWidth="250px" minHeight="250px">
      <PieChart width={500} height={500}>
        <Pie
          data={experiment.groups}
          dataKey="proportion"
          nameKey="name"
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
        >
          {COLORS.map((color, index) => (
            <Cell cursor="help" key={`cell-${index}`} fill={color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
