import React, { MouseEvent, ChangeEvent } from 'react';
import { connect } from 'react-redux';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import TablePagination from '@material-ui/core/TablePagination';

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

const useStyles = makeStyles(theme => ({
  amount: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(0, 2)
  }
}));

// TableFooter is not imported because this component needs to exist outside the table
// So that the table pagination actions and input do not overflow
const EnhancedTableFooter = (props: Props) => {
  const { data, onChangeRowsPerPage, onChangePage, page, rowsPerPage } = props;
  const classes = useStyles();

  const amount = data.reduce((accumulator, row) => {
    return accumulator + row.price;
  }, 0);

  return (
    <>
      <div className={classes.amount}>
        <FormControl margin="normal">
          <InputLabel htmlFor="adornment-amount">{'Amount'}</InputLabel>
          <Input
            id="adornment-amount"
            value={amount < 0 ? `(${Math.abs(amount).toFixed(2)})` : amount.toFixed(2)}
            readOnly
            startAdornment={<InputAdornment position="start">{'$'}</InputAdornment>}
          />
        </FormControl>
      </div>

      <TablePagination
        count={data.length}
        component="div"
        page={page}
        onChangePage={onChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        onChangeRowsPerPage={onChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  // This component does not care about sorted data - only the filtered data
  data: getFilteredData(state)
});

export default connect(mapStateToProps)(EnhancedTableFooter);
