import React, { useState } from 'react';
import { Cell, Legend, PieChart, Pie, Sector } from 'recharts';

// Material UI
import { useTheme } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

// Helper Functions
import getCategoryColor from 'lib/CategoryColors';

// TypeScript
import { Transaction } from 'ducks/data';

// TODO: Try and understand this a bit.
const ActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {payload.isNegative ? `$${value.toFixed(2)}` : `$(${value.toFixed(2)})`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

type Props = {
  data: Array<Transaction>;
};

const CategoryChart = (props: Props) => {
  const { data } = props;
  const [activeCategory, setActiveCategory] = useState(0);
  const theme: Theme = useTheme();

  const onCategorySelect = (data: Array<Transaction>, index: number) => {
    setActiveCategory(index);
  };

  const categories: Array<{ name: string; value: number; isNegative: boolean; color: string }> = [];

  data.forEach(transaction => {
    // Skip undefined categories
    if (!transaction.category) return;

    const category = categories.find(element => {
      return element.name === transaction.category;
    });

    if (category) {
      // If the category already exits, sum up the value
      category.value += transaction.price;
    } else {
      // Otherwise add this unique category
      categories.push({
        isNegative: transaction.price < 0 ? true : false,
        name: transaction.category,
        value: transaction.price,
        color: getCategoryColor(transaction.category)
      });
    }
  });

  categories.forEach(row => {
    row.value = Math.abs(row.value);
  });

  return (
    <PieChart
      width={600}
      height={600}
      margin={{
        top: theme.spacing(4),
        right: theme.spacing(4),
        bottom: theme.spacing(4),
        left: theme.spacing(4)
      }}
    >
      <Pie
        data={categories.length ? categories : [{ id: 'none', name: 'No Categories', value: 1 }]}
        dataKey="value"
        innerRadius={80}
        outerRadius={160}
        activeIndex={activeCategory}
        activeShape={ActiveShape}
        onMouseEnter={onCategorySelect}
      >
        {categories.map((entry, index) => (
          <Cell key={entry.name} fill={entry.color} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  );
};

export default CategoryChart;
