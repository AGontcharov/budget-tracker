// @flow
import * as React from 'react';

// Custom Component
import BudgetTable from 'budgetTable';
import Dashboard from 'dashboard';
import Navbar from 'layout/Navbar';
import Layout from 'layout/Layout';
import Footer from 'layout/Footer';
import DropFile from 'components/DropFile';

// Material UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

type Props = {};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#039be5'
    },
    secondary: {
      main: '#ef5350'
    },
    accent: {
      main: '#E0E0E0'
    }
  },
  typography: {
    useNextVariants: true
  }
});

const styles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const App = (props: Props) => {
  return (
    <MuiThemeProvider theme={theme}>
      {/* <React.StrictMode> */}
      <Layout>
        <Navbar />
        <div style={styles}>
          <DropFile />
          <BudgetTable />
          <Dashboard />
        </div>
        <Footer />
      </Layout>
      {/* </React.StrictMode> */}
    </MuiThemeProvider>
  );
};

export default App;
