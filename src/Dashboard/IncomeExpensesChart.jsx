// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from 'recharts';

// Material UI
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
              Income: income,
              Expenses: Math.abs(expenses)
            }
          ]}
        >
          <XAxis type="category" dataKey="name" />
          <YAxis type="number" />
          <Tooltip />
          <Bar dataKey="Income" fill="#8884d8" />
          <Bar dataKey="Expenses" fill="#82ca9d" />
          <Legend align="left" />
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
