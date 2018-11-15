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
import EnhancedToolBar from 'budgetTable/EnhancedToolBar';
import EnhancedTableHead from 'budgetTable/EnhancedTableHead';
import EnhancedTableBody from 'budgetTable/EnhancedTableBody';
import TablePaginationActions from 'budgetTable/TablePaginationActions';

// Helper Functions
import { getFilteredData, loadData, loadFilters, loadSort } from 'ducks/data';

// Flow Type
import type { Filter, Sort, Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  loadData: (Array<Transaction>) => void,
  loadFilters: (Array<Filter>) => void,
  loadSort: Sort => void,
  orderBy: string,
  order: 'asc' | 'desc',
  theme: Object
};

type State = {
  transactions: Array<Transaction>,
  isFilter: boolean,
  filters: Array<{ name: string, value: string }>,
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
      rowsPerPage: 10,
      page: 0
    };
  }

  // TODO: Might be hacky
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({ transactions: this.props.data, page: 0 });
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

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc';
    }

    this.props.loadSort({ orderBy, order });
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
    const { theme, data, order, orderBy } = this.props;
    const { isFilter, page, rowsPerPage } = this.state;

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

    // Get the total amount
    const totalAmount = data.reduce((accumulator, row) => {
      return accumulator + row.price;
    }, 0);

    return (
      // TODO: Alternating Table color scheme?
      <Paper style={styles.paper}>
        <div ref={this.tableRef}>
          <EnhancedToolBar
            data={data}
            title={'Transactions'}
            onFilterClicked={this.onFilterClicked}
          />
        </div>

        <Table aria-labelledby="tableTitle" style={styles.table}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={this.onRequestSort} />
          <EnhancedTableBody
            isFilter={isFilter}
            minRows={10}
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
                count={data.length}
                page={page}
                onChangePage={this.onChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
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
    data: getFilteredData(state.transactions),
    order: state.transactions.sort.order,
    orderBy: state.transactions.sort.orderBy
  };
};

export default withTheme()(
  connect(
    mapStateToProps,
    { loadData, loadFilters, loadSort }
  )(BudgetTable)
);
