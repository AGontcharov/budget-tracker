import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

// Material UI
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
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
import EnhancedToolBar from 'budgetTable/components/EnhancedToolBar';
import EnhancedTableHead from 'budgetTable/components/EnhancedTableHead';
import EnhancedTableBody from 'budgetTable/components/EnhancedTableBody';
import TablePaginationActions from 'budgetTable/components/TablePaginationActions';

// Helper Functions
import { loadData, loadFilters, loadSort } from 'ducks/data';

// Flow Type
import { Filter, Sort, Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  classes: {
    paper: string;
    tableWrapper: string;
    row: string;
    input: string;
    amount: string;
  };
  filters: Array<{ name: string; value: string }>;
  data: Array<Transaction>;
  loadData: (payload: Array<Transaction>) => void;
  loadFilters: (payload: Array<Filter>) => void;
  loadSort: (payload: Sort) => void;
  orderBy: string;
  order: 'asc' | 'desc';
  theme: Object;
};

type State = {
  isFilter: boolean;
  filters: Array<Filter>;
  rowsPerPage: number;
  page: number;
};

// TODO: Figure out Table Styles
const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    paper: {
      margin: spacing.unit * 3.5
    },
    tableWrapper: {
      overflowX: 'auto'
    },
    row: {
      backgroundColor: palette.background.default
    },
    input: {
      fontSize: '13'
    },
    amount: {
      textAlign: 'right'
    }
  });

class BudgetTable extends React.Component<Props, State> {
  tableRef: { current: null | HTMLDivElement };

  constructor(props: Props) {
    super(props);

    this.tableRef = React.createRef();

    this.state = {
      isFilter: false,
      filters: [],
      rowsPerPage: Number(localStorage.getItem('rowsPerPage')) || 10,
      page: 0
    };
  }

  // TODO: This causes an extra render.
  // Is there a better way to reset the page or even the whole table?
  // Key again?
  componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({ page: 0 });
    }
  }

  onFilterClicked = () => {
    this.setState({ isFilter: !this.state.isFilter });
    this.props.loadFilters([]);
  };

  onFilter = (name: string) => (event: any) => {
    this.setFilters(name, event.target.value);
  };

  setFilters: (name: string, value: string) => void = debounce((name, value) => {
    let filters = [...this.props.filters];
    let index;

    filters.forEach((filter, position) => {
      if (filter.name === name) {
        index = position;
      }
    });

    if (index === undefined) {
      filters.push({ name, value });
    } else {
      filters[index] = { name, value };
    }

    this.props.loadFilters(filters);
  }, 200);

  onRequestSort = (property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.props.orderBy === property && this.props.order === 'desc') {
      order = 'asc';
    }

    this.props.loadSort({ orderBy, order });
  };

  onCategoryChange = (index: number) => (value: string) => {
    let transactions = [...this.props.data];

    transactions[index].category = value;
    this.props.loadData(transactions);
  };

  onDescriptionChange = (index: number, value: string) => {
    let transactions = [...this.props.data];

    transactions[index].description = value;
    this.props.loadData(transactions);
  };

  onChangePage = (event: any, page: number) => {
    this.setState({ page }, () => {
      this.tableRef.current &&
        this.tableRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  onChangeRowsPerPage = (event: any) => {
    localStorage.setItem('rowsPerPage', event.target.value);
    this.setState({ rowsPerPage: parseInt(event.target.value, 10) }, () => {
      this.tableRef.current &&
        this.tableRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  render() {
    const { classes, data, order, orderBy } = this.props;
    const { isFilter, page, rowsPerPage } = this.state;

    // Get the total amount
    const totalAmount = data.reduce((accumulator, row) => {
      return accumulator + row.price;
    }, 0);

    return (
      // TODO: Alternating Table color scheme?
      <Paper className={classes.paper}>
        <EnhancedToolBar
          // data={data}
          title={'Transactions'}
          onFilterClicked={this.onFilterClicked}
        />

        <div ref={this.tableRef} className={classes.tableWrapper}>
          <Table aria-labelledby="tableTitle">
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={this.onRequestSort} />
            <EnhancedTableBody
              isFilter={isFilter}
              minRows={10}
              onFilter={this.onFilter}
              onCategoryChange={this.onCategoryChange}
              onDescriptionChange={this.onDescriptionChange}
              order={order}
              orderBy={orderBy}
              page={page}
              rowsPerPage={rowsPerPage}
            />
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} padding="dense" className={classes.amount}>
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
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    filters: state.transactions.filters,
    data: state.transactions.data,
    order: state.transactions.sort.order,
    orderBy: state.transactions.sort.orderBy
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { loadData, loadFilters, loadSort }
  )(BudgetTable)
);
