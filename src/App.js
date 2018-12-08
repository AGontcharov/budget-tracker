// @flow
import * as React from 'react';

// Custom Component
import BudgetTable from 'budgetTable';
import Dashboard from 'dashboard';
import DrawerMenu from 'layout/DrawerMenu';
import Layout from 'layout/Layout';
import Footer from 'layout/Footer';
import DropFile from 'components/DropFile';

// Material UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Icons
import MenuIcon from '@material-ui/icons/Menu';

type Props = {};

type State = {
  open: boolean
};

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

class App extends React.Component<Props, State> {
  state = {
    open: false
  };

  onClick = () => {
    this.setState({ open: !this.state.open });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        {/* <React.StrictMode> */}
        <Layout>
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" aria-label="Menu" onClick={this.onClick}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit">
                Budget Tracker
              </Typography>
            </Toolbar>
          </AppBar>
          <DrawerMenu open={open} onClose={this.onClose} />
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
  }
}

export default App;
