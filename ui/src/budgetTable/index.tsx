import React, { useRef, useState, useEffect, ChangeEvent, MouseEvent } from 'react';
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
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

// Custom Components
import EnhancedTableBody from 'budgetTable/components/EnhancedTableBody';
import EnhancedTableHead from 'budgetTable/components/EnhancedTableHead';
import EnhancedToolBar from 'budgetTable/components/EnhancedToolBar';
import TablePaginationActions from 'budgetTable/components/TablePaginationActions';

// Helper Functions
import { loadData, loadFilters } from 'ducks/data';
import { parseNumber } from 'lib/Utils';

// TypeScript
import { Filter, Transaction } from 'ducks/data';
import { AppState } from 'ducks';
import { Values } from 'components/Form/AutoSave';

type Props = {
  classes: {
    paper: string;
    tableWrapper: string;
    row: string;
    input: string;
    amount: string;
  };
  data: Array<Transaction>;
  loadData: (payload: Array<Transaction>) => void;
  loadFilters: (payload: Array<Filter>) => void;
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

const BudgetTable = (props: Props) => {
  const { classes, data, loadData, loadFilters } = props;

  const [isFilter, setIsFilter] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(Number(localStorage.getItem('rowsPerPage')) || 10);
  const [page, setPage] = useState(0);

  const tableRef: { current: null | HTMLDivElement } = useRef(null);

  useEffect(() => {
    tableRef.current && tableRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [page, rowsPerPage]);

  const onFilterClicked = () => {
    setIsFilter(!isFilter);
    loadFilters([]);
  };

  const onCategoryChange = (index: number) => (value: string) => {
    let transactions = [...data];
    transactions[index].category = value;
    loadData(transactions);
  };

  const onChangePage = (event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  };

  const onChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('rowsPerPage', event.target.value);
    setRowsPerPage(Number(event.target.value));
  };

  const onSave = debounce((values: Values) => {
    let transactions = [...data];

    // Price is saved as a string in the form, however it is parsed back to number on save.
    const formatedValues = { ...values, price: parseNumber(values.price) };
    transactions[values.id] = formatedValues;

    // TODO: This is called twice for price field change.
    loadData(transactions);
  }, 1000);

  // Get the total amount
  // TODO: This isn't reflected to the filtered dataset
  const totalAmount = data.reduce((accumulator, row) => {
    return accumulator + row.price;
  }, 0);

  return (
    // TODO: Alternating Table color scheme?
    <Paper className={classes.paper}>
      <EnhancedToolBar title={'Transactions'} onFilterClicked={onFilterClicked} />

      <div ref={tableRef} className={classes.tableWrapper}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead />
          <EnhancedTableBody
            isFilter={isFilter}
            minRows={10}
            onCategoryChange={onCategoryChange}
            onSave={onSave}
            page={page}
            rowsPerPage={rowsPerPage}
          />
          {/* TODO: Create a component for this and subscribe to the filtered data so count is properly reflected */}
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
                onChangePage={onChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onChangeRowsPerPage={onChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state: AppState) => ({
  data: state.transactions.data
});

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { loadData, loadFilters }
  )(BudgetTable)
);
