// @flow
import * as React from 'react';
import { Cell, Legend, PieChart, Pie, Sector } from 'recharts';
import { connect } from 'react-redux';

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
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`$${value}`}</text>
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

    const styles = {
      margin: theme.spacing.unit * 4
    };

    // TODO: Initial display?
    // We will have 0 categories need some text.
    if (!data.length) return null;

    // TODO: Using abs so the pie chart can display, how to deal with computing positive
    // and negative data together?
    // ALSO kind of ugly function
    const categories = data.reduce((accumulator, row, index) => {
      if (row.category && accumulator) {
        let isCategoryExist = false;

        accumulator.forEach(category => {
          if (category.name === row.category) {
            isCategoryExist = true;
            category.value += Math.abs(row.price);
          }
        });

        return isCategoryExist
          ? accumulator
          : accumulator.concat({ id: row.id, name: row.category, value: Math.abs(row.price) });
      } else {
        return accumulator;
      }
    }, []);

    const colors = categories.map(category => getCategoryColor(category.name));

    return (
      <div style={styles}>
        <PieChart width={600} height={500}>
          <Pie
            data={categories}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: getFilteredData(state.transactions)
  };
};

export default withTheme()(connect(mapStateToProps)(CategoryChart));
