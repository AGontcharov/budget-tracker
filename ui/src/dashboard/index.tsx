import React from 'react';
import { connect } from 'react-redux';

// Custom Component
import CategoryChart from 'dashboard/components/CategoryChart';
import ExpenseTimeChart from 'dashboard/components/ExpenseTimeChart';
import IncomeExpensesChart from 'dashboard/components/IncomeExpensesChart';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Helper Functions
import { getFilteredData } from 'ducks/data';

// TypeScript
import { Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  data: Array<Transaction>;
};

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(3.5)
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty: {
    margin: theme.spacing(3.5)
  }
}));

const Dashboard = ({ data }: Props) => {
  const classes = useStyles();
  const availableMonths = [...Array.from(new Set(data.map(item => item.date.getMonth())))];

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
        <Grid container spacing={2}>
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

const mapStateToProps = (state: AppState) => ({
  data: getFilteredData(state)
});

export default connect(
  mapStateToProps,
  { getFilteredData }
)(Dashboard);
