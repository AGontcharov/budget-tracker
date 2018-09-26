// @flow
import * as React from 'react';
import { Bar } from 'react-chartjs-2';

// Material UI
import { withTheme } from '@material-ui/core/styles';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

class BarChart extends React.Component<Props> {
  render() {
    const { theme } = this.props;

    const styles = {
      canvasWrapper: {
        margin: theme.spacing.unit * 4,
        border: '1px solid',
        borderColor: theme.palette.accent.main
      }
    };

    let income = 0;
    let expense = 0;

    this.props.data.forEach(transaction => {
      if (transaction.price > 0) {
        income = income + transaction.price;
      } else {
        expense = expense + transaction.price;
      }
    });

    const data = {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          label: 'Income vs Expenses',
          data: [income, Math.abs(expense)],
          backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255,99,132,1)'],
          borderWidth: 1
        }
      ]
    };

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      layout: {
        padding: theme.spacing.unit * 2
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      maintainAspectRatio: false
    };

    return (
      <div style={styles.canvasWrapper}>
        <Bar data={data} options={options} height={400} width={400} />
      </div>
    );
  }
}

export default withTheme()(BarChart);
