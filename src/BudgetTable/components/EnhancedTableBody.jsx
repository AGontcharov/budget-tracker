// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Material Ui
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

// Custom Components
import Select from 'budgetTable/components/Select';

// Helper Functions
import { getData } from 'ducks/data';
import { headers } from 'lib/Utils';
import getCategoryColor from 'lib/CategoryColors';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  isLoading: boolean,
  isFilter: boolean,
  minRows: number,
  onFilter: string => Function,
  onCategoryChange: number => Function,
  order: string,
  orderBy: string,
  page: number,
  rowsPerPage: number
};

const EnhancedTableBody = (props: Props) => {
  const {
    data,
    isFilter,
    isLoading,
    minRows,
    onFilter,
    onCategoryChange,
    page,
    rowsPerPage
  } = props;

  const currentRows = Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const emptyRows = rowsPerPage - currentRows;

  // TODO: How to transition this to withStyles?
  const styles = {
    input: {
      fontSize: 14,
      minWidth: 200
    },
    // 49px is the size of one row
    emptyRow: {
      height: minRows > emptyRows ? 49 * emptyRows : 49 * (minRows - currentRows)
    }
  };

  return (
    <TableBody>
      {isFilter && (
        <TableRow>
          {headers.map(filter => {
            return (
              <TableCell
                padding="dense"
                key={filter.id}
                align={filter.id === 'price' ? 'right' : 'center'}
              >
                <Input
                  placeholder="Search..."
                  inputProps={{ 'aria-label': 'Description' }}
                  onChange={onFilter(filter.id)}
                  style={styles.input}
                />
              </TableCell>
            );
          })}
        </TableRow>
      )}

      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
        return (
          <TableRow
            hover
            key={row.id}
            style={{
              background: row.category ? getCategoryColor(row.category) : undefined
            }}
          >
            <TableCell padding="dense">{row.date.toDateString()}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>
              <Select
                onChange={onCategoryChange(row.id)}
                value={row.category ? { value: row.category, label: row.category } : null}
              />
            </TableCell>
            <TableCell padding="dense">{row.details}</TableCell>
            <TableCell padding="dense">{'Description...'}</TableCell>
            <TableCell align="right">
              {row.price < 0 ? `(${Math.abs(row.price)})` : row.price}
            </TableCell>
          </TableRow>
        );
      })}

      {currentRows < minRows && (
        <TableRow style={styles.emptyRow}>
          <TableCell colSpan={6} style={{ textAlign: 'center' }}>
            {!data.length && !isLoading && <Typography align="center">{'No data...'}</Typography>}
            {isLoading && <LinearProgress />}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

const mapStateToProps = state => {
  return {
    data: getData(state.transactions),
    isLoading: state.transactions.isLoading
  };
};

export default connect(mapStateToProps)(EnhancedTableBody);
