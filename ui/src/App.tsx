import React from 'react';
import { connect } from 'react-redux';

// Custom Component
import BudgetTable from 'budgetTable';
import Dashboard from 'dashboard';
import Navbar from 'layout/Navbar';
import Layout from 'layout/Layout';
import Footer from 'layout/Footer';
import DropFile from 'components/DropFile';

// Material UI
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

// Helper Functions
import { isLoadingSelector } from 'ducks/data';

// TypeScript
import { AppState } from 'ducks';

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
    body1: {
      fontSize: 14
    }
  }
});

type Props = {
  /**
   * @ignore
   */
  isLoading: boolean;
};

const App = ({ isLoading }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Navbar />
        <DropFile />
        {/* Remount the Budget Table anytime we upload a new file */}
        <BudgetTable key={`${isLoading}`} />
        <Dashboard />
        <Footer />
      </Layout>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: AppState) => ({ isLoading: isLoadingSelector(state) });

export default connect(mapStateToProps)(App);
