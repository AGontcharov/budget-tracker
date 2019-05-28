import React, { SyntheticEvent } from 'react';
import { connect } from 'react-redux';

// Material UI
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

// Material UI Icons
import CommentIcon from '@material-ui/icons/Comment';

// Helper Functions
import { loadSort } from 'ducks/data';

// TypeScript
import { AppState } from 'ducks';
import { Sort } from 'ducks/data';

export const headers = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    tooltip: 'Date of transaction'
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
    tooltip: 'The type of transaction.'
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    tooltip: 'The category of the transaction'
  },
  {
    id: 'details',
    numeric: false,
    disablePadding: false,
    label: 'Details',
    tooltip: 'Details of the transaction'
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
    tooltip: 'More information about the transaction'
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price $ (CAD)',
    tooltip: 'The price of the transaction'
  }
];

type Props = {
  classes: {
    icon: string;
  };
  loadSort: (payload: Sort) => void;
  order: 'asc' | 'desc';
  orderBy: string;
};

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    icon: {
      marginRight: spacing.unit
    }
  });

const EnhancedTableHead = (props: Props) => {
  const { classes, loadSort } = props;

  const createSortHandler = (property: string) => (event: SyntheticEvent) => {
    const orderBy = property;
    let order = 'desc';

    if (props.orderBy === property && props.order === 'desc') {
      order = 'asc';
    }

    loadSort({ orderBy, order });
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'center'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={props.orderBy === row.id ? props.order : false}
          >
            <Tooltip
              title={row.tooltip}
              placement={row.numeric ? 'bottom-end' : 'bottom-start'}
              enterDelay={300}
            >
              <TableSortLabel
                active={props.orderBy === row.id}
                direction={props.order}
                onClick={createSortHandler(row.id)}
              >
                {row.label === 'Description' && (
                  <CommentIcon className={classes.icon} fontSize="small" />
                )}
                {row.label}
              </TableSortLabel>
            </Tooltip>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const mapStateToProps = (state: AppState) => ({
  order: state.transactions.sort.order,
  orderBy: state.transactions.sort.orderBy
});

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { loadSort }
  )(EnhancedTableHead)
);
