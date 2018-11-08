// @flow
import * as React from 'react';
import { Cell, Legend, PieChart, Pie, Tooltip } from 'recharts';
import { connect } from 'react-redux';

// Material UI
import { withTheme } from '@material-ui/core/styles';

// Helper Functions
import { getFilteredData } from 'ducks/data';
import getCategoryColor from 'lib/CategoryColors';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

type State = {
  data: Array<Transaction>
};

class CategoryChart extends React.Component<Props, State> {
  render() {
    const { theme, data } = this.props;

    const styles = {
      margin: theme.spacing.unit * 4
    };

    // TODO: Using abs so the pie chart can display, how to deal with computing positive
    // and negative data together?
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
        <PieChart width={500} height={500}>
          <Pie data={categories} dataKey="value" innerRadius={100} outerRadius={200}>
            {categories.map((entry, index) => (
              <Cell key={entry.id} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
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
