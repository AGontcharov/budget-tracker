// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Helper Functions
import { getFilteredData } from 'ducks/data';
import { MONTHS } from 'lib/constants';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

type State = {
  availableMonths: Array<string>,
  month: number
};

class ExpenseTimeChart extends React.Component<Props, State> {
  state = {
    availableMonths: [],
    month: ''
  };

  componentDidMount = () => {
    const availableMonths = [...new Set(this.props.data.map(item => item.date.getMonth()))];
    this.setState({ month: availableMonths[0], availableMonths });
  };

  // TODO: Not a big fan of doing it this way
  // componentDidUpdate({ data }) {
  //   const availableMonths = [...new Set(this.props.data.map(item => item.date.getMonth()))];

  //   if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
  //     this.setState({ data, month: availableMonths[0], availableMonths });
  //   }
  // }

  onChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ month: event.target.value });
  };

  render() {
    const { theme } = this.props;
    const { availableMonths, month } = this.state;

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

    return (
      <div style={styles.wrapper}>
        <FormControl style={styles.form}>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={this.onChange}>
            {availableMonths.map(month => {
              return (
                <MenuItem id={month} key={month} value={month}>
                  {MONTHS[month]}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Area dataKey="value" /> */}
          <Area type="monotone" dataKey="value" stroke="#000" />
        </AreaChart>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: getFilteredData(state.transactions)
  };
};

export default withTheme()(connect(mapStateToProps)(ExpenseTimeChart));
