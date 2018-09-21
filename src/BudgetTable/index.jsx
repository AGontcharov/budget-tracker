// @flow
import * as React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';

// Custom Components
import EnhancedToolBar from './EnhancedToolBar';
import EnhancedTableHead from './EnhancedTableHead';
import TablePaginationActions from './TablePaginationActions';

// Helper Functions
import { getSorting, stableSort, rows } from '../utils';
import rawData from './RawData';

// Flow Type
import type { Transaction } from '../DropFile';

// TODO: Move to paginated component?
const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
);

type Props = {
  data: Array<Transaction>
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
      transactions: rawData,
      isFilter: false,
      filters: [],
      order: 'asc',
      orderBy: 'date',
      rowsPerPage: 10,
      page: 0
    };
  }

  onFilterClicked = () => {
    this.setState({ isFilter: !this.state.isFilter });
  };

  onFilter = (event: SyntheticEvent<>, name: string) => {
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

  onRequestSort = (event: SyntheticEvent<>, property: string) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  onCategoryChange = (event: SyntheticEvent<>, index: any) => {
    let transactions = [...this.state.transactions];
    transactions[index].category = event.target.value;
    this.setState({ transactions });
  };

  onChangePage = (event: SyntheticEvent<>, page: number) => {
    this.setState({ page });
  };

  onChangeRowsPerPage = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { transactions, filters, isFilter, order, orderBy, page, rowsPerPage } = this.state;

    // Filter the data
    const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
      return filteredSoFar.filter(row => {
        return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
      });
    }, transactions);

    // Get the total amount
    const totalAmount = filteredData
      .reduce((accumulator, row) => {
        return accumulator + row.price;
      }, 0)
      .toFixed(2);

    return (
      <Paper style={{ margin: 16 }}>
        <EnhancedToolBar title={'Transactions'} onFilterClicked={this.onFilterClicked} />
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={this.onRequestSort} />
          <TableBody>
            {/* TODO: Create custom filter component probably */}
            {isFilter && (
              <TableRow>
                {rows.map(filter => {
                  return (
                    <TableCell padding="dense" key={filter.id}>
                      <Input
                        placeholder="Search..."
                        inputProps={{
                          'aria-label': 'Description'
                        }}
                        onChange={event => this.onFilter(event, filter.id)}
                        style={{ fontSize: 14 }}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            )}

            {stableSort(filteredData, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover key={`${row.date}-${index}`}>
                    <TableCell padding="dense">{row.date.toDateString()}</TableCell>
                    <TableCell padding="dense">{row.type}</TableCell>
                    <TableCell padding="dense">
                      <Input
                        placeholder="None"
                        inputProps={{
                          'aria-label': 'Description'
                        }}
                        onChange={event => this.onCategoryChange(event, row.id)}
                        style={{ fontSize: 13 }}
                      />
                    </TableCell>
                    <TableCell padding="dense">{row.details}</TableCell>
                    <TableCell padding="dense" numeric>
                      {row.price < 0 ? `(${Math.abs(row.price)})` : row.price}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
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
                    value={totalAmount < 0 ? `(${Math.abs(totalAmount)})` : totalAmount}
                    readOnly
                    // onChange={this.handleChange('amount')}
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
                ActionsComponent={TablePaginationActionsWrapped}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

export default BudgetTable;
