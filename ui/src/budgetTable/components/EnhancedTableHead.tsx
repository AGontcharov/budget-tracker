import React, { SyntheticEvent } from 'react';

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
import { headers } from 'lib/Utils';

type Props = {
  classes: {
    icon: string;
  };
  onRequestSort: (property: string) => void;
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
  const { classes, order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: string) => (event: SyntheticEvent) => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'center'}
            padding={row.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === row.id ? order : false}
          >
            <Tooltip
              title={row.tooltip}
              placement={row.numeric ? 'bottom-end' : 'bottom-start'}
              enterDelay={300}
            >
              <TableSortLabel
                active={orderBy === row.id}
                direction={order}
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

export default withStyles(styles, { withTheme: true })(EnhancedTableHead);
