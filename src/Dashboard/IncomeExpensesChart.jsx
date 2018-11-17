// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';

// Material UI,
import { withTheme } from '@material-ui/core/styles';

// Helper Functions
import { getFilteredData } from 'ducks/data';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

class IncomeExpensesChart extends React.Component<Props> {
  render() {
    const { theme, data } = this.props;

    const styles = {
      margin: theme.spacing.unit * 4
    };

    // TODO: Initial Display?
    if (!data.length) return null;

    let income = 0;
    let expenses = 0;

    data.forEach(transaction => {
      if (transaction.price > 0) {
        income = income + transaction.price;
      } else {
        expenses = expenses + transaction.price;
      }
    });

    // TODO: Standardize colors
    return (
      <div style={styles}>
        <BarChart
          width={500}
          height={500}
          data={[
            {
              name: 'Total Amount',
              Income: income.toFixed(2),
              Expenses: Math.abs(expenses).toFixed(2)
            }
          ]}
        >
          <XAxis type="category" dataKey="name" />
          <YAxis type="number" tickFormatter={tick => `$${tick}`} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="Income" fill="#8884d8" name="Income" />
          <Bar dataKey="Expenses" fill="#82ca9d" name="Expense" />
          <Legend />
        </BarChart>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: getFilteredData(state.transactions)
  };
};

export default withTheme()(connect(mapStateToProps)(IncomeExpensesChart));
