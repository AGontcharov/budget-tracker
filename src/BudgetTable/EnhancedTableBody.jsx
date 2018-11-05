// @flow
import * as React from 'react';

// Material Ui
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

// Custom Components
import IntegrationReactSelect from 'Select';
import StringFilter from 'budgetTable/StringFilter';

// Helper Functions
import { getSorting, stableSort, headers } from 'lib/Utils';
import getCategoryColor from 'lib/CategoryColors';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  data: Array<Transaction>,
  isFilter: boolean,
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
      onFilter,
      onCategoryChange,
      order,
      orderBy,
      page,
      rowsPerPage
    } = this.props;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    const styles = {
      emptyRow: {
        height: 49 * emptyRows
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

        {/* TODO: Sorting done only here, but we want it to apply on the export too, and maybe everywhere else */}
        {stableSort(data, getSorting(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            return (
              <TableRow
                hover
                key={`${row.date}-${index}`}
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
        {emptyRows > 0 && (
          <TableRow style={styles.emptyRow}>
            <TableCell colSpan={6} style={{ textAlign: 'center' }}>
              {!data.length && <Typography align="center">{'No data...'}</Typography>}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  }
}

export default EnhancedTableBody;
