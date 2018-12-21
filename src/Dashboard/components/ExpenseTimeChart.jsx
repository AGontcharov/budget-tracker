// @flow
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Custom Component
import SelectMonth from 'dashboard/components/SelectMonth';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import { red, green } from '@material-ui/core/colors';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  availableMonths: Array<number>,
  classes: {
    areaChart: string
  },
  data: Array<Transaction>,
  theme: Object
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: 150
  },
  areaChart: {
    justifySelf: 'center'
  }
};

const ExpenseTimeChart = (props: Props) => {
  const { availableMonths, classes, theme } = props;
  const [month, setMonth] = useState(availableMonths[0]);

  const onMonthChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  const gradientOffset = data => {
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

  //TODO: Better to move elsewhere or keep logic here?
  const data: Array<{ name: string, value: number }> = [
    { name: 'Week 1', value: 0 },
    { name: 'Week 2', value: 0 },
    { name: 'Week 3', value: 0 },
    { name: 'Week 4', value: 0 },
    { name: 'Week 5', value: 0 }
  ];

  // TODO: Performance increase?
  props.data
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

  const off = gradientOffset(data);

  data.forEach(week => {
    week.value = week.value.toFixed(2);
  });

  return (
    <div style={styles.wrapper}>
      <SelectMonth month={month} availableMonths={availableMonths} onChange={onMonthChange} />

      <AreaChart
        width={600}
        height={600}
        data={data}
        margin={{
          top: theme.spacing.unit * 4,
          right: theme.spacing.unit * 4,
          bottom: theme.spacing.unit * 4,
          left: theme.spacing.unit * 4
        }}
        className={classes.areaChart}
      >
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor={green[400]} stopOpacity={1} />
            <stop offset={off} stopColor={red[400]} stopOpacity={1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={tick => `$${tick}`} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#000" fill="url(#splitColor)" />
      </AreaChart>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(ExpenseTimeChart);
