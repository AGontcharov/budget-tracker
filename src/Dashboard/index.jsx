// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Custom Component
import IncomeExpensesChart from 'Dashboard/IncomeExpensesChart';
import CategoryChart from 'Dashboard/CategoryChart';
// import DoughnutChart from 'Dashboard/DoughnutChart';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

class Dashboard extends React.Component<Props> {
  render() {
    const { theme } = this.props;

    const data = this.props.data;

    const styles = {
      paper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: theme.spacing.unit * 2
      },
      wrapper: {
        display: 'flex'
      }
    };

    return (
      <Paper style={styles.paper}>
        <Toolbar>
          <Typography variant="title" id="tableTitle">
            {'Dashboard'}
          </Typography>
        </Toolbar>
        <div style={styles.wrapper}>
          <IncomeExpensesChart data={data} />
          <CategoryChart data={data} />
          {/* <DoughnutChart data={data} /> */}
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.transactions.data
  };
};

export default withTheme()(connect(mapStateToProps)(Dashboard));
