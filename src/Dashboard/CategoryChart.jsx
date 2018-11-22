// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { Cell, Legend, PieChart, Pie, Sector } from 'recharts';

// Material UI
import { withTheme } from '@material-ui/core/styles';

// Helper Functions
import { getFilteredData } from 'ducks/data';
import getCategoryColor from 'lib/CategoryColors';

// Flow Type
import type { Transaction } from 'ducks/data';

// TODO: Try and understand this a bit.
const ActiveShape = props => {
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
        {payload.isNegative ? `$${value}` : `$(${value})`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

type Props = {
  data: Array<Transaction>,
  theme: Object
};

type State = {
  activeCategory: number
};

class CategoryChart extends React.Component<Props, State> {
  state = {
    activeCategory: 0
  };

  onCategorySelect = (data, index) => {
    this.setState({ activeCategory: index });
  };

  render() {
    const { theme, data } = this.props;

    //TODO: Maybe I can map this beforehand
    let categories = data.reduce((accumulator, row, index) => {
      if (accumulator && row.category) {
        let categoryExists = false;

        accumulator.forEach(category => {
          if (category.name === row.category) {
            category.value += row.price;
            categoryExists = true;
          }
        });

        return categoryExists
          ? accumulator
          : accumulator.concat({
              id: row.id,
              isNegative: row.price < 0 ? true : false,
              name: row.category,
              value: row.price
            });
      }

      return accumulator;
    }, []);

    categories.forEach(row => (row.value = Math.abs(row.value)));
    const colors = categories.map(category => getCategoryColor(category.name));

    return (
      <PieChart
        width={600}
        height={500}
        margin={{
          top: theme.spacing.unit * 4,
          right: theme.spacing.unit * 4,
          bottom: theme.spacing.unit * 4,
          left: theme.spacing.unit * 4
        }}
        style={{ justifySelf: 'center' }}
      >
        <Pie
          data={categories.length ? categories : [{ id: 'none', name: 'No Categories', value: 1 }]}
          dataKey="value"
          innerRadius={80}
          outerRadius={160}
          activeIndex={this.state.activeCategory}
          activeShape={ActiveShape}
          onMouseEnter={this.onCategorySelect}
        >
          {categories.map((entry, index) => (
            <Cell key={entry.id} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: getFilteredData(state.transactions)
  };
};

export default withTheme()(connect(mapStateToProps)(CategoryChart));
