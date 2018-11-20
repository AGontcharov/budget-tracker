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
        // TODO: This causes the paper growth, however removing it also shrinks paper to grid width
        // width: '100%',
        width: '90%',
        maxWidth: 1200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: theme.spacing.unit * 2
      },
      wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      empty: {
        margin: theme.spacing.unit * 2
      },
      grid: {
        // TODO: Maybe this is a solution for material design grids
        display: 'grid',
        // Each grid is a minimum of 600px or a maximum of 1 fraction unit
        gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
        justifyContent: 'center',
        alignItems: 'center'
      }
    };

    return (
      <React.Fragment>
        <Paper style={styles.paper}>
          <Toolbar>
            <Typography variant="h6" id="tableTitle">
              {'Dashboard'}
            </Typography>
          </Toolbar>
          {isEmpty ? (
            <div style={styles.wrapper}>
              <Typography style={styles.empty}>
                {'To view the Dashboard load some data...'}{' '}
              </Typography>
            </div>
          ) : (
            <div style={styles.grid}>
              <IncomeExpensesChart />
              <CategoryChart />
              <ExpenseTimeChart />
            </div>
          )}
        </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isEmpty: !state.transactions.data.length
  };
};

export default withTheme()(connect(mapStateToProps)(Dashboard));
