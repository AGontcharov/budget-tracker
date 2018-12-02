// @flow
import * as React from 'react';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';

// Material UI,
import { withTheme } from '@material-ui/core/styles';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

class IncomeExpensesChart extends React.Component<Props> {
  render() {
    const { theme, data } = this.props;

    let income = 0;
    let expenses = 0;

    data.forEach(transaction => {
      if (transaction.price > 0) {
        income = income + transaction.price;
      } else {
        expenses = expenses + transaction.price;
      }
    });

    return (
      <BarChart
        width={600}
        height={500}
        margin={{
          top: theme.spacing.unit * 4,
          right: theme.spacing.unit * 4,
          bottom: theme.spacing.unit * 4,
          left: theme.spacing.unit * 4
        }}
        style={{ justifySelf: 'center' }}
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
        <Bar dataKey="Income" fill="green" name="Income" />
        <Bar dataKey="Expenses" fill="red" name="Expense" />
        <Legend />
      </BarChart>
    );
  }
}

export default withTheme()(IncomeExpensesChart);
