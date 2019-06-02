import React, { ChangeEvent, MouseEvent, useCallback, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { debounce, cloneDeep } from 'lodash';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';

// Custom Components
import EnhancedTableBody from 'budgetTable/components/EnhancedTableBody';
import EnhancedTableHead from 'budgetTable/components/EnhancedTableHead';
import EnhancedToolBar from 'budgetTable/components/EnhancedToolBar';
import EnhancedTableFooter from 'budgetTable/components/EnhanedTableFooter';

// Helper Functions
import { loadData, loadFilters } from 'ducks/data';

// TypeScript
import { Filter, Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  data: Array<Transaction>;
  loadData: (payload: Array<Transaction>) => void;
  loadFilters: (payload: Array<Filter>) => void;
};

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(3.5)
  },
  tableWrapper: {
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
}));

// TODO: Figure out Table Styles
const BudgetTable = (props: Props) => {
  const { data, loadData, loadFilters } = props;
  const classes = useStyles();

  const [isFilter, setIsFilter] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(Number(localStorage.getItem('rowsPerPage')) || 10);
  const [page, setPage] = useState(0);

  // This ref used to scroll the table into view on page and rows per page change
  const tableRef: { current: null | HTMLDivElement } = useRef(null);

  useEffect(() => {
    tableRef.current && tableRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [page, rowsPerPage]);

  const onFilterClicked = useCallback(() => {
    setIsFilter(!isFilter);
    loadFilters([]);
  }, [isFilter, loadFilters]);

  const onChangePage = useCallback((event: MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }, []);

  const onChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    localStorage.setItem('rowsPerPage', event.target.value);
    setRowsPerPage(Number(event.target.value));
  }, []);

  const onSave = debounce((values: Transaction) => {
    let transactions = cloneDeep(data);
    transactions[values.id] = values;

    loadData(transactions);
  }, 200);

  const onAddRows = () => {
    let transactions = cloneDeep(data);
    const emptyRows = [];

    for (let i = 0; i < 50; i++) {
      emptyRows.push({
        id: data.length + i,
        date: new Date(),
        type: '',
        category: '',
        details: '',
        description: '',
        price: 0
      });
    }

    loadData(transactions.concat(emptyRows));
  };

  return (
    // TODO: Alternating Table color scheme?
    <Paper className={classes.paper}>
      {/* Scroll up to the toolbar */}
      <div ref={tableRef}>
        <EnhancedToolBar onFilterClicked={onFilterClicked} />
      </div>

      {/* Add horizontal overflow to the table */}
      <div className={classes.tableWrapper}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead />
          <EnhancedTableBody
            onAddRows={onAddRows}
            isFilter={isFilter}
            minRows={5}
            onSave={onSave}
            page={page}
            rowsPerPage={rowsPerPage}
          />
          <EnhancedTableFooter
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </Table>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state: AppState) => ({
  // Store the initial data in memory so that it can be modified in O(1) time
  data: state.transactions.data
});

export default connect(
  mapStateToProps,
  { loadData, loadFilters }
)(BudgetTable);
