// @flow
import * as React from 'react';

// Custom Component
import Layout from 'Layout';
import Footer from 'Footer';
import DropFile from 'DropFile';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
  }
});

class App extends React.Component<Props> {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Layout>
          <AppBar position="static">
            <Toolbar>
              <IconButton color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                Budget Tracker
              </Typography>
            </Toolbar>
          </AppBar>
          <DropFile />
          <Footer />
        </Layout>
      </MuiThemeProvider>
    );
  }
}

export default App;
