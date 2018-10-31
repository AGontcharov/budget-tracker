// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

// Custom Components
import EnhancedToolBar from 'BudgetTable/EnhancedToolBar';
import EnhancedTableHead from 'BudgetTable/EnhancedTableHead';
import EnhancedTableBody from 'BudgetTable/EnhancedTableBody';
import TablePaginationActions from 'BudgetTable/TablePaginationActions';

// Helper Functions
import { loadData, loadFilters } from 'ducks/data';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  loadData: (Array<Transaction>) => void,
  loadFilters: (Array<{ name: string, value: string }>) => void,
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

    this.tableRef = React.createRef();

    this.state = {
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
    this.props.loadFilters(filters);
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
    this.props.loadData(transactions);
  };

  onChangePage = (event: SyntheticEvent<>, page: number) => {
    this.setState({ page }, () => {
      this.tableRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  onChangeRowsPerPage = (event: SyntheticInputEvent<HTMLInputElement>) => {
    // TODO: Scroll to top of table on table size change. It seems like the heigh pushes the scrollbar
    // down after it has scrolled into view.
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) });

    // this.setState({ rowsPerPage: parseInt(event.target.value, 10) }, () => {
    //   this.tableRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    // });
  };

  render() {
    const { theme } = this.props;
    const { filters, isFilter, order, orderBy, page, rowsPerPage, transactions } = this.state;

    const styles = {
      paper: {
        margin: theme.spacing.unit * 2
      },
      table: {
        minWidth: 900,
        overflowX: 'auto'
      },
      row: {
        backgroundColor: theme.palette.background.default
      },
      input: {
        fontSize: '13'
      },
      amount: {
        textAlign: 'right'
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
        <div ref={this.tableRef}>
          <EnhancedToolBar
            data={filteredData}
            title={'Transactions'}
            onFilterClicked={this.onFilterClicked}
          />
        </div>

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
            <TableRow>
              <TableCell colSpan={5} padding="dense" style={styles.amount}>
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

export default withTheme()(
  connect(
    mapStateToProps,
    { loadData, loadFilters }
  )(BudgetTable)
);
