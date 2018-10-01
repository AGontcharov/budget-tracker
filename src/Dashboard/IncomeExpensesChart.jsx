// @flow
import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Legend, Tooltip } from 'recharts';

// Material UI
import { withTheme } from '@material-ui/core/styles';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

class IncomeExpensesChart extends React.Component<Props> {
  render() {
    const { theme } = this.props;

    const styles = {
      margin: theme.spacing.unit * 4
      // border: '1px solid',
      // borderColor: theme.palette.accent.main
    };

    let income = 0;
    let expenses = 0;

    this.props.data.forEach(transaction => {
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

export default withTheme()(IncomeExpensesChart);
