import React from 'react';

// Custom Component
import BudgetTable from 'budgetTable';
// import Dashboard from 'dashboard';
import Navbar from 'layout/Navbar';
import Layout from 'layout/Layout';
import Footer from 'layout/Footer';
import DropFile from 'components/DropFile';

// Material UI
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Palette, PaletteOptions } from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    accent: { main: string };
  }

  interface PaletteOptions {
    accent?: { main: string };
  }
}

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

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <Layout>
        <Navbar />
        <DropFile />
        <BudgetTable />
        {/* <Dashboard /> */}
        <Footer />
      </Layout>
    </MuiThemeProvider>
  );
};

export default App;
