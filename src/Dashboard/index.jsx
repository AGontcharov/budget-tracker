// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Custom Component
import IncomeExpensesChart from 'dashboard/IncomeExpensesChart';
import ExpenseTimeChart from 'dashboard/ExpenseTimeChart';
import CategoryChart from 'dashboard/CategoryChart';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

type Props = {
  isEmpty: boolean,
  theme: Object
};

class Dashboard extends React.Component<Props> {
  render() {
    const { isEmpty, theme } = this.props;

    const styles = {
      paper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: theme.spacing.unit * 2,
        minWidth: 900
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
      },
      empty: {
        margin: theme.spacing.unit * 2
      }
    };

    return (
      <Paper style={styles.paper}>
        <Toolbar>
          <Typography variant="h6" id="tableTitle">
            {'Dashboard'}
          </Typography>
        </Toolbar>
        <div style={styles.wrapper}>
          {isEmpty ? (
            <Typography style={styles.empty}>
              {'To view the Dashboard load some data...'}{' '}
            </Typography>
          ) : (
            <React.Fragment>
              <ExpenseTimeChart />
              <IncomeExpensesChart />
              <CategoryChart />
            </React.Fragment>
          )}
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    isEmpty: !state.transactions.data.length
  };
};

export default withTheme()(connect(mapStateToProps)(Dashboard));
