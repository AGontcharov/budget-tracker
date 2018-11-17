// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Material UI
import { withTheme } from '@material-ui/core/styles';

// Helper Functions
import { getFilteredData } from 'ducks/data';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>
};

type State = {};

class ExpenseTimeChart extends React.Component<Props, State> {
  render() {
    // TODO: Accumulate price for same date
    const data = this.props.data.map(transaction => {
      return { name: transaction.date.getDate(), value: transaction.price };
    });

    console.log(data);

    return (
      <AreaChart width={1200} height={500} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area dataKey="value" />
      </AreaChart>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: getFilteredData(state.transactions)
  };
};

export default withTheme()(connect(mapStateToProps)(ExpenseTimeChart));
