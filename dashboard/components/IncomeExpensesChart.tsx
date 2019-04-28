import * as React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from 'recharts';

// Material UI,
import { withTheme } from '@material-ui/core/styles';
import { red, green } from '@material-ui/core/colors';

// Flow Type
import { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>;
  theme: Object;
};

const IncomeExpensesChart = (props: Props) => {
  const { data, theme } = props;

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
      height={600}
      margin={{
        top: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4,
        bottom: theme.spacing.unit * 4,
        left: theme.spacing.unit * 4
      }}
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
      <Bar dataKey="Income" fill={green[400]} name="Income" />
      <Bar dataKey="Expenses" fill={red[400]} name="Expense" />
      <Legend />
    </BarChart>
  );
};

export default withTheme()(IncomeExpensesChart);
