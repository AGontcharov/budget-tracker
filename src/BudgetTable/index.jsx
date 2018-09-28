// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';

// Custom Components
import EnhancedToolBar from 'BudgetTable/EnhancedToolBar';
import EnhancedTableHead from 'BudgetTable/EnhancedTableHead';
import EnhancedTableBody from 'BudgetTable/EnhancedTableBody';
import TablePaginationActions from 'BudgetTable/TablePaginationActions';

// Helper Functions
import rawData from 'BudgetTable/RawData';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  theme: Object
};

type State = {
  transactions: Array<Transaction>,
  isFilter: boolean,
  filters: Array<{ name: string, value: string }>,
  order: string,
  orderBy: string,
  rowsPerPage: number,
  page: number
};

class BudgetTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      // Test data
      // transactions: rawData,
      transactions: props.data,
      isFilter: false,
      filters: [],
      order: 'asc',
      orderBy: 'date',
      rowsPerPage: 10,
      page: 0
    };
  }

  // TODO: Might be hacky
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({ transactions: this.props.data });
    }
  }

  onFilterClicked = () => {
    this.setState({ isFilter: !this.state.isFilter });
  };

  onFilter = (name: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
    let filters = [...this.state.filters];
    let index;

    filters.forEach((filter, position) => {
      if (filter.name === name) {
        index = position;
      }
    });

    if (index === undefined) {
      filters.push({ name, value: event.target.value });
    } else {
      filters[index] = { name, value: event.target.value };
    }

    this.setState({ filters });
  };

  onRequestSort = (property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  onCategoryChange = (index: number) => (value: string) => {
    let transactions = [...this.state.transactions];
    transactions[index].category = value;
    this.setState({ transactions });
  };

  onChangePage = (event: SyntheticEvent<>, page: number) => {
    this.setState({ page });
  };

  onChangeRowsPerPage = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
  };

  render() {
    const { theme } = this.props;
    const { filters, isFilter, order, orderBy, page, rowsPerPage, transactions } = this.state;

    const styles = {
      paper: {
        margin: theme.spacing.unit * 2
      },
      table: {
        minWidth: 700,
        overflowX: 'auto'
      },
      row: {
        backgroundColor: theme.palette.background.default
      },
      input: {
        fontSize: '13'
      }
    };

    // Filter the data
    const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
      return filteredSoFar.filter(row => {
        return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
      });
    }, transactions);

    // Get the total amount
    const totalAmount = filteredData.reduce((accumulator, row) => {
      return accumulator + row.price;
    }, 0);

    return (
      // TODO: Alternating Table color scheme?
      <Paper style={styles.paper}>
        <EnhancedToolBar
          data={filteredData}
          title={'Transactions'}
          onFilterClicked={this.onFilterClicked}
        />
        <Table aria-labelledby="tableTitle" style={styles.table}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={this.onRequestSort} />
          <EnhancedTableBody
            data={filteredData}
            isFilter={isFilter}
            onFilter={this.onFilter}
            onCategoryChange={this.onCategoryChange}
            order={order}
            orderBy={orderBy}
            page={page}
            rowsPerPage={rowsPerPage}
          />
          <TableFooter>
            {/* TODO: Do I need these extra TableCells? */}
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell padding="dense">
                <FormControl margin="dense">
                  <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
                  <Input
                    id="adornment-amount"
                    value={
                      totalAmount < 0
                        ? `(${Math.abs(totalAmount).toFixed(2)})`
                        : totalAmount.toFixed(2)
                    }
                    readOnly
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  />
                </FormControl>
              </TableCell>
            </TableRow>
            <TableRow>
              <TablePagination
                count={filteredData.length}
                page={page}
                onChangePage={this.onChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50]}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.transactions.data
  };
};

export default withTheme()(connect(mapStateToProps)(BudgetTable));
