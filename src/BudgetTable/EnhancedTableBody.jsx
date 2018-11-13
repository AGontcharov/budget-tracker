// @flow
import * as React from 'react';
import { connect } from 'react-redux';

// Material Ui
import LinearProgress from '@material-ui/core/LinearProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

// Custom Components
import IntegrationReactSelect from 'budgetTable/Select';
import StringFilter from 'budgetTable/StringFilter';

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

class EnhancedTableBody extends React.Component<Props> {
  render() {
    const {
      data,
      isFilter,
      isLoading,
      minRows,
      onFilter,
      onCategoryChange,
      page,
      rowsPerPage
    } = this.props;

    const currentRows = Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const emptyRows = rowsPerPage - currentRows;

    const styles = {
      emptyRow: {
        // 49px is the size of one row
        height: minRows > emptyRows ? 49 * emptyRows : 49 * (minRows - currentRows)
      }
    };

    return (
      <TableBody>
        {isFilter && (
          <TableRow>
            {headers.map(filter => {
              return (
                <TableCell padding="dense" key={filter.id} numeric={filter.id === 'price'}>
                  <StringFilter onChange={onFilter(filter.id)} />
                </TableCell>
              );
            })}
          </TableRow>
        )}

        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                <IntegrationReactSelect
                  onChange={onCategoryChange(row.id)}
                  value={row.category ? { value: row.category, label: row.category } : null}
                />
              </TableCell>
              <TableCell padding="dense">{row.details}</TableCell>
              <TableCell numeric>
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
  }
}

const mapStateToProps = state => {
  return {
    data: getData(state.transactions),
    isLoading: state.transactions.isLoading
  };
};

export default connect(mapStateToProps)(EnhancedTableBody);
