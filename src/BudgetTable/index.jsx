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

import Input from '@material-ui/core/Input';

// Custom Components
import EnhancedToolBar from './EnhancedToolBar';
import EnhancedTableHead from './EnhancedTableHead';
import TablePaginationActions from './TablePaginationActions';

// Helper Functions
import { getSorting, stableSort } from '../utils';
import rawData from './RawData';

export const rows = [
  { id: 'date', numeric: false, disablePadding: false, label: 'Date of Transaction' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Transcation Type' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'details', numeric: false, disablePadding: false, label: 'Details' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price $ (CAD)' }
];

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
  data: Array<{
    date: string,
    type: string,
    category: string,
    details: string,
    price: string
  }>
};

type State = {
  isFilter: boolean,
  filters: Array<{ name: string, value: string }>,
  order: string,
  orderBy: string,
  rowsPerPage: number,
  page: number
};

class BudgetTable extends React.Component<Props, State> {
  state = {
    isFilter: false,
    filters: [],
    order: 'asc',
    orderBy: 'date',
    rowsPerPage: 10,
    page: 0
  };

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

  onChangePage = (event: SyntheticEvent<>, page: number) => {
    this.setState({ page });
  };

  onChangeRowsPerPage = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    // const { data } = this.props;
    const { filters, isFilter, order, orderBy, page, rowsPerPage } = this.state;

    // Testing Data
    const data = rawData;

    // Filter the data
    const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
      return filteredSoFar.filter(row => {
        return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
      });
    }, data);

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
                    <TableCell key={filter.id} style={{ padding: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Input
                          placeholder="Search..."
                          inputProps={{
                            'aria-label': 'Description'
                          }}
                          onChange={event => this.onFilter(event, filter.id)}
                        />
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            )}

            {stableSort(filteredData, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow key={`${row.date}-${index}`}>
                    {/* <TableCell>{row.date.toDateString()}</TableCell> */}
                    <TableCell>{row.date.toDateString()}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.details}</TableCell>
                    <TableCell numeric>
                      {row.price < 0 ? `(${Math.abs(row.price)})` : row.price}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                count={filteredData.length}
                page={page}
                onChangePage={this.onChangePage}
                rowsPerPage={rowsPerPage}
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
