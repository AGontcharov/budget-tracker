// @flow
import React, { useState } from 'react';
import { connect } from 'react-redux';

// Material UI
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

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
  onCategoryChange: number => string => void,
  // onDescriptionChange: number => string => void,
  onDescriptionChange: (number, string) => void,
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const currentRows = Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const emptyRows = rowsPerPage - currentRows;

  // TODO: How to transition this to withStyles?
  const styles = {
    input: {
      fontSize: 13,
      width: 200
    },
    // 49px is the size of one row
    emptyRow: {
      height: minRows > emptyRows ? 49 * emptyRows : 49 * (minRows - currentRows)
    },
    buttonWrapper: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    button: { fontSize: 14, margin: 4 }
  };

  const onSubmit = () => {
    setAnchorEl(null);
  };

  const onDescriptionClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableBody>
      {isFilter && (
        <TableRow>
          {headers.map(filter => (
            <TableCell padding="dense" key={filter.id}>
              <Input
                placeholder="Search..."
                inputProps={{ 'aria-label': 'Description' }}
                onChange={onFilter(filter.id)}
                style={styles.input}
              />
            </TableCell>
          ))}
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
            {/* Date */}
            <TableCell padding="dense">{row.date.toDateString()}</TableCell>

            {/* Type */}
            <TableCell>{row.type}</TableCell>

            {/* Category */}
            <TableCell>
              <Select
                onChange={onCategoryChange(row.id)}
                value={row.category ? { value: row.category, label: row.category } : null}
              />
            </TableCell>

            {/* Details */}
            <TableCell padding="dense">{row.details}</TableCell>

            {/* Descriptions */}
            <TableCell onClick={onDescriptionClick} padding="dense">
              {row.description}
            </TableCell>
            <Popover
              anchorEl={anchorEl}
              elevation={0}
              onClose={onClose}
              open={open}
              PaperProps={{
                square: true,
                style: { border: '1px solid grey' }
              }}
            >
              {/* TODO: Add form */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* <form onSubmit={onSubmit}> */}
                <TextField
                  autoFocus
                  style={{ width: 256, margin: 8 }}
                  inputProps={{
                    style: { fontSize: 13 }
                  }}
                />
                <div style={styles.buttonWrapper}>
                  <Button type="submit" color="primary" style={styles.button}>
                    {'Save'}
                  </Button>
                  <Button onClick={onClose} color="secondary" style={styles.button}>
                    {'Cancel'}
                  </Button>
                </div>
                {/* </form> */}
              </div>
            </Popover>

            {/* Price */}
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
