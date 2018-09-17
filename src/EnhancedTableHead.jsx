// @flow

import * as React from 'react';

// Material UI
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

const rows = [
  { id: 'date', numeric: false, disablePadding: false, label: 'Date of Transaction' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Transcation Type' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'details', numeric: false, disablePadding: false, label: 'Details' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price $ (CAD)' }
];

type Props = {
  onRequestSort: Function,
  order: string,
  orderBy: string
};

type State = {};

class EnhancedTableHead extends React.Component<Props, State> {
  createSortHandler = (property: string) => (event: SyntheticEvent<>) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

export default EnhancedTableHead;
