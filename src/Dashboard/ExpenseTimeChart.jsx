// @flow
import * as React from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Custom Component
import SelectMonth from 'dashboard/SelectMonth';

// Material UI
import { withTheme } from '@material-ui/core/styles';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  availableMonths: Array<number>,
  data: Array<Transaction>,
  theme: Object
};

type State = {
  month: number
};

class ExpenseTimeChart extends React.Component<Props, State> {
  state = {
    month: this.props.availableMonths[0]
  };

  onMonthChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ month: Number(event.target.value) });
  };

  gradientOffset = data => {
    const dataMax = Math.max(...data.map(week => week.value));
    const dataMin = Math.min(...data.map(week => week.value));

    if (dataMax <= 0) {
      return 0;
    } else if (dataMin >= 0) {
      return 1;
    } else {
      return dataMax / (dataMax - dataMin);
    }
  };

  render() {
    const { availableMonths, theme } = this.props;
    const { month } = this.state;

    const styles = {
      wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      form: {
        width: 150
      },
      chart: {
        justifySelf: 'center'
      }
    };

    // Better to move elsewhere or keep logic here?
    const data = [
      { name: 'Week 1', value: 0 },
      { name: 'Week 2', value: 0 },
      { name: 'Week 3', value: 0 },
      { name: 'Week 4', value: 0 },
      { name: 'Week 5', value: 0 }
    ];

    this.props.data
      .filter(row => row.date.getMonth() === month)
      .forEach(transaction => {
        if (transaction.date.getDate() <= 7) {
          data[0].value += transaction.price;
        } else if (transaction.date.getDate() <= 14) {
          data[1].value += transaction.price;
        } else if (transaction.date.getDate() <= 21) {
          data[2].value += transaction.price;
        } else if (transaction.date.getDate() <= 28) {
          data[3].value += transaction.price;
        } else {
          data[4].value += transaction.price;
        }
      });

    const off = this.gradientOffset(data);

    return (
      <div style={styles.wrapper}>
        <SelectMonth
          month={month}
          availableMonths={availableMonths}
          onChange={this.onMonthChange}
        />

        <AreaChart
          width={600}
          height={500}
          data={data}
          margin={{
            top: theme.spacing.unit * 4,
            right: theme.spacing.unit * 4,
            bottom: theme.spacing.unit * 4,
            left: theme.spacing.unit * 4
          }}
          style={styles.chart}
        >
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="green" stopOpacity={1} />
              <stop offset={off} stopColor="red" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="value" stroke="#000" fill="url(#splitColor)" />
        </AreaChart>
      </div>
    );
  }
}

export default withTheme()(ExpenseTimeChart);
