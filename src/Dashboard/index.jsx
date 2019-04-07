// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Custom Component
import IncomeExpensesChart from 'dashboard/components/IncomeExpensesChart';
import ExpenseTimeChart from 'dashboard/components/ExpenseTimeChart';
import CategoryChart from 'dashboard/components/CategoryChart';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Helper Functions
import { getFilteredData } from 'ducks/data';

// Flow Type
import type { Transaction } from 'ducks/data';

import Grid from '@material-ui/core/Grid';

type Props = {
  data: Array<Transaction>,
  classes: {
    paper: string,
    wrapper: string,
    empty: string
  }
};

const styles = theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing.unit * 3.5
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    margin: theme.spacing.unit * 3.5
  }
});

const Dashboard = (props: Props) => {
  const { classes, data } = props;
  const availableMonths = [...new Set(data.map(item => item.date.getMonth()))];

  return (
    <Paper className={classes.paper}>
      <Toolbar>
        <Typography variant="h6" id="tableTitle">
          {'Dashboard'}
        </Typography>
      </Toolbar>
      {!data.length ? (
        <div className={classes.wrapper}>
          <Typography className={classes.empty}>
            {'To view the Dashboard load some data...'}{' '}
          </Typography>
        </div>
      ) : (
        <Grid container spacing={16}>
          <Grid container item xs={12} lg={6} justify="center">
            <IncomeExpensesChart data={data} />
          </Grid>
          <Grid container item xs={12} lg={6} justify="center">
            <CategoryChart data={data} />
          </Grid>
          <Grid container item xs={12} lg={6} justify="center">
            <ExpenseTimeChart
              // Specifying a key allows for the component to reset whenever the starting month changes
              key={availableMonths[0]}
              availableMonths={availableMonths}
              data={data}
            />
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

const mapStateToProps = state => {
  return {
    data: getFilteredData(state.transactions)
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { getFilteredData }
  )(Dashboard)
);
