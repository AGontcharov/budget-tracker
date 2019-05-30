import React, { MouseEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';

// Material UI
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

// Custom Components
import TablePaginationActions from 'budgetTable/components/TablePaginationActions';

// Helper Functions
import { getFilteredData } from 'ducks/data';

// TypeScript
import { Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  /**
   * @ignore
   */
  classes: {
    amount: string;
  };

  /**
   * @ignore
   */
  data: Array<Transaction>;

  /**
   * Callback fired when the page is changed.
   * @type {Function}
   */
  onChangePage: (event: MouseEvent<HTMLButtonElement> | null, page: number) => void;

  /**
   * Callback fired when the number of rows per page is changed.
   * @type {Function}
   */
  onChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;

  /**
   * The zero-based index of the current page.
   * @type {number}
   */
  page: number;

  /**
   * The number of rows per page.
   * @type {number}
   */
  rowsPerPage: number;
};

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    amount: {
      textAlign: 'right'
    }
  });

const EnhancedTableFooter = (props: Props) => {
  const { classes, data, onChangeRowsPerPage, onChangePage, page, rowsPerPage } = props;

  const amount = data.reduce((accumulator, row) => {
    return accumulator + row.price;
  }, 0);

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={6} padding="dense" className={classes.amount}>
          <FormControl margin="dense">
            <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
            <Input
              id="adornment-amount"
              value={amount < 0 ? `(${Math.abs(amount).toFixed(2)})` : amount.toFixed(2)}
              readOnly
              startAdornment={<InputAdornment position="start">{'$'}</InputAdornment>}
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
  );
};

const mapStateToProps = (state: AppState) => ({
  // This component does not care about sorted data - only the filtered data
  data: getFilteredData(state)
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(EnhancedTableFooter)
);
