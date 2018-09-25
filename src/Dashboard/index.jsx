// @flow
import * as React from 'react';

// Custom Component
import BarChart from 'Dashboard/BarChart';
import DoughnutChart from 'Dashboard/DoughnutChart';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Helper Functions
import rawData from 'BudgetTable/RawData';

// Flow Type
import type { Transaction } from 'DropFile';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

class Dashboard extends React.Component<Props> {
  render() {
    const { theme } = this.props;

    // const data = rawData;
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
      /* TODO: Might be time for Redux */
      <Paper style={styles.paper}>
        <Toolbar>
          <Typography variant="title" id="tableTitle">
            {'Dashboard'}
          </Typography>
        </Toolbar>
        <div style={styles.wrapper}>
          <BarChart data={data} />
          <DoughnutChart data={data} />
        </div>
      </Paper>
    );
  }
}

export default withTheme()(Dashboard);
