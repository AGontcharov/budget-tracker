import React, { ChangeEvent } from 'react';
import { Form, Field } from 'react-final-form';
import { connect } from 'react-redux';

// Custom Components
import FinalTextField from 'components/Form/FinalTextField';

// Material UI
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Custom Components
import Select from 'budgetTable/components/Select';

// Helper Functions
import { loadData, getData } from 'ducks/data';
import { headers } from 'lib/Utils';
import getCategoryColor from 'lib/CategoryColors';

// TypeScript
import { Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  data: Array<Transaction>;
  isLoading: boolean;
  isFilter: boolean;
  loadData: (data: Array<Transaction>) => void;
  minRows: number;
  onFilter: (name: string) => (event: ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (index: number) => (value: string) => void;
  order: string;
  orderBy: string;
  page: number;
  rowsPerPage: number;
};

const EnhancedTableBody = (props: Props) => {
  const {
    data,
    isFilter,
    isLoading,
    loadData,
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
      fontSize: 13
    },
    // 49px is the size of one row
    emptyRow: {
      height: minRows > emptyRows ? 49 * emptyRows : 49 * (minRows - currentRows)
    }
  };

  const onAddRows = () => {
    const emptyRows = [];

    for (let i = 0; i < 10; i++) {
      emptyRows.push({
        id: i,
        date: new Date(),
        type: 'Chequing',
        category: '',
        details: '',
        description: '',
        price: 15
      });
    }

    loadData(emptyRows);
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
                fullWidth
                onChange={onFilter(filter.id)}
                style={styles.input}
              />
            </TableCell>
          ))}
        </TableRow>
      )}
      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
        console.log(row);

        return (
          <TableRow
            hover
            key={row.id}
            style={{
              background: row.category ? getCategoryColor(row.category) : undefined
            }}
          >
            <Form onSubmit={() => {}} initialValues={row}>
              {() => {
                return (
                  <>
                    {/* Date */}
                    <TableCell padding="dense">
                      <Field
                        name="date"
                        component={FinalTextField}
                        format={value => value.toDateString()}
                        value="date"
                        fullWidth
                        InputProps={{ style: styles.input, disableUnderline: true }}
                      />
                    </TableCell>

                    {/* Type */}
                    <TableCell padding="dense">
                      <Field
                        name="type"
                        component={FinalTextField}
                        value="type"
                        fullWidth
                        InputProps={{ style: styles.input, disableUnderline: true }}
                      />
                    </TableCell>

                    {/* Category */}
                    <TableCell padding="dense">
                      <Select
                        onChange={onCategoryChange(row.id)}
                        value={row.category ? { value: row.category, label: row.category } : null}
                      />
                    </TableCell>

                    {/* Details */}
                    <TableCell padding="dense">
                      <Field
                        name="details"
                        component={FinalTextField}
                        value="details"
                        fullWidth
                        InputProps={{ style: styles.input, disableUnderline: true }}
                      />
                    </TableCell>

                    {/* Descriptions */}
                    <TableCell padding="dense">
                      <Field
                        name="description"
                        component={FinalTextField}
                        value="description"
                        fullWidth
                        InputProps={{ style: styles.input, disableUnderline: true }}
                      />
                    </TableCell>

                    {/* Price */}
                    <TableCell padding="dense">
                      <Field
                        name="price"
                        component={FinalTextField}
                        format={value => (value < 0 ? `(${Math.abs(value)})` : value)}
                        value="price"
                        fullWidth
                        InputProps={{ style: styles.input, disableUnderline: true }}
                        inputProps={{ style: { textAlign: 'right' } }}
                      />
                    </TableCell>
                  </>
                );
              }}
            </Form>
          </TableRow>
        );
      })}

      {currentRows < minRows && (
        <TableRow style={styles.emptyRow}>
          <TableCell colSpan={6} align="center">
            {!data.length && !isLoading && (
              <Button color="primary" onClick={onAddRows} size="large" variant="outlined">
                {'Add Rows'}
              </Button>
            )}
            {isLoading && <LinearProgress />}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    data: getData(state.transactions),
    isLoading: state.transactions.isLoading
  };
};

export default connect(
  mapStateToProps,
  { loadData }
)(EnhancedTableBody);
