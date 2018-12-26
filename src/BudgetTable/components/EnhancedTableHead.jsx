// @flow
import * as React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

import CommentIcon from '@material-ui/icons/Comment';

// Helper Functions
import { headers } from 'lib/Utils';

type Props = {
  classes: {
    icon: string
  },
  onRequestSort: string => void,
  order: string,
  orderBy: string
};

const styles = theme => ({
  icon: {
    marginRight: theme.spacing.unit
  }
});

const EnhancedTableHead = (props: Props) => {
  const createSortHandler = (property: string) => (event: SyntheticEvent<>) => {
    props.onRequestSort(property);
  };

  const { classes, order, orderBy } = props;

  return (
    <TableHead>
      <TableRow>
        {headers.map(row => {
          return (
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
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
};

export default withStyles(styles, { withTheme: true })(EnhancedTableHead);
