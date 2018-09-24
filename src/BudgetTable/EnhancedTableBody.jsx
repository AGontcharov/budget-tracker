// @flow
import * as React from 'react';

// Material Ui
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Custom Components
import IntegrationReactSelect from 'Select';
import StringFilter from 'BudgetTable/StringFilter';

// Helper Functions
import { getSorting, stableSort, headers } from 'Utils';

// Flow Type
import type { Transaction } from 'DropFile';

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

    // TODO: No Data text or something
    // if (!data.length) {
    //   return (
    //     <TableBody>
    //       <TableRow>
    //         <TableCell>{'adsfdsfasdf'}</TableCell>
    //       </TableRow>
    //     </TableBody>
    //   );
    // }

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
        {stableSort(data, getSorting(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            return (
              <TableRow hover key={`${row.date}-${index}`}>
                <TableCell padding="dense">{row.date}</TableCell>
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
      </TableBody>
    );
  }
}

export default EnhancedTableBody;
