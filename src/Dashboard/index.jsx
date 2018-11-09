// @flow
import * as React from 'react';

// Custom Component
import IncomeExpensesChart from 'dashboard/IncomeExpensesChart';
import CategoryChart from 'dashboard/CategoryChart';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

type Props = {
  theme: Object
};

// TODO: Get data from connect here and pass it down?
class Dashboard extends React.Component<Props> {
  render() {
    const { theme } = this.props;

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
          <Typography variant="h6" id="tableTitle">
            {'Dashboard'}
          </Typography>
        </Toolbar>
        <div style={styles.wrapper}>
          <IncomeExpensesChart />
          <CategoryChart />
        </div>
      </Paper>
    );
  }
}

export default withTheme()(Dashboard);
