import React, { ChangeEvent, useCallback } from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { debounce } from 'lodash';

// Custom Components
import AutoSave from 'components/Form/AutoSave';
import FinalTextField from 'components/Form/FinalTextField';
import FinalDatePicker from 'components/Form/FinalDatePicker';
import { headers } from 'budgetTable/components/EnhancedTableHead';

// Material UI
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Material UI Date Pickers
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

// Custom Components
import Select from 'budgetTable/components/Select';

// Helper Functions
import { getData, isLoadingSelector, filterSelector, loadData, loadFilters } from 'ducks/data';
import getCategoryColor from 'lib/CategoryColors';

// TypeScript
import { Filter, Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  /**
   * @ignore
   */
  data: Array<Transaction>;

  /**
   * @ignore
   */
  filters: Array<{ name: string; value: string }>;

  /**
   * @ignore
   */
  isLoading: boolean;

  /**
   * @type {boolean}
   */
  isFilter: boolean;

  /**
   * @ignore
   */
  loadFilters: (payload: Array<Filter>) => void;

  /**
   * The minimum number of rows to show per page.
   * @type {number}
   */
  minRows: number;

  /**
   *
   * @type {Function}
   */
  onAddRows: () => void;

  /**
   * @type {Function}
   */
  onSave: (values: Transaction) => void;

  /**
   * The current table page.
   * @type {number}
   */
  page: number;

  /**
   * The number of rows per page.
   * @type {number}
   */
  rowsPerPage: number;
};

const EnhancedTableBody = (props: Props) => {
  const {
    data,
    isFilter,
    isLoading,
    loadFilters,
    minRows,
    onAddRows,
    onSave,
    page,
    rowsPerPage
  } = props;

  const currentRows = Math.min(rowsPerPage, data.length - page * rowsPerPage);
  const emptyRows = rowsPerPage - currentRows;

  // TODO: How to transition this to makeStyles?
  const styles = {
    input: {
      fontSize: 13
    },
    dateWidth: {
      minWitdh: 150
    },
    detailsWidth: {
      minWidth: 200
    },
    // 49px is the size of one row
    emptyRow: {
      height: minRows > emptyRows ? 49 * emptyRows : 49 * (minRows - currentRows)
    }
  };

  const changeFilters: (name: string, value: string) => void = debounce((name, value) => {
    const filters = [...props.filters];
    let index = -1;

    filters.forEach((filter, position) => {
      if (filter.name === name) {
        index = position;
      }
    });

    if (index === -1) {
      filters.push({ name, value });
    } else {
      filters[index] = { name, value };
    }

    loadFilters(filters);
  }, 200);

  const onFilter = useCallback(
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      changeFilters(name, event.target.value);
    },
    [changeFilters]
  );

  return (
    <TableBody>
      {isFilter && (
        <TableRow>
          {headers.map(filter => (
            <TableCell size="medium" key={filter.id}>
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
        return (
          <Form
            key={row.id}
            onSubmit={() => {}}
            initialValues={row}
            // TODO: We only subscribe to this so that the row background color changes
            // Could be optimized as we only need the value for category
            subscription={{ values: true }}
          >
            {({ values }) => {
              return (
                <TableRow
                  hover
                  style={{
                    background: values.category ? getCategoryColor(values.category) : undefined
                  }}
                >
                  <AutoSave values={values} save={onSave} />

                  {/* Date */}
                  <TableCell size="medium">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Field
                        name="date"
                        component={FinalDatePicker}
                        format={value => value.toDateString()}
                        parse={value => new Date(value)}
                        fullWidth
                        InputProps={{ style: styles.input, disableUnderline: true }}
                      />
                    </MuiPickersUtilsProvider>
                  </TableCell>

                  {/* Type */}
                  <TableCell size="medium">
                    <Field
                      name="type"
                      component={FinalTextField}
                      value="type"
                      fullWidth
                      InputProps={{ style: styles.input, disableUnderline: true }}
                    />
                  </TableCell>

                  {/* Category */}
                  <TableCell size="medium">
                    <Field name="category" component={ReactSelectAdapter} value="category" />
                  </TableCell>

                  {/* Details */}
                  <TableCell size="medium">
                    <Field
                      name="details"
                      component={FinalTextField}
                      value="details"
                      fullWidth
                      InputProps={{
                        style: { ...styles.input, ...styles.detailsWidth },
                        disableUnderline: true
                      }}
                    />
                  </TableCell>

                  {/* Descriptions */}
                  <TableCell size="medium">
                    <Field
                      name="description"
                      component={FinalTextField}
                      value="description"
                      fullWidth
                      InputProps={{
                        style: { ...styles.input, ...styles.dateWidth },
                        disableUnderline: true
                      }}
                    />
                  </TableCell>

                  {/* Price */}
                  <TableCell size="medium">
                    <Field
                      name="price"
                      component={FinalTextField}
                      value="price"
                      fullWidth
                      InputProps={{ style: styles.input, disableUnderline: true }}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                  </TableCell>
                </TableRow>
              );
            }}
          </Form>
        );
      })}

      {currentRows < minRows && (
        <TableRow style={styles.emptyRow}>
          <TableCell colSpan={6} align="center">
            {isLoading ? (
              <LinearProgress />
            ) : (
              <Button color="primary" onClick={onAddRows} size="large" variant="outlined">
                {'Add Rows'}
              </Button>
            )}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

// TODO: Fix types
const ReactSelectAdapter = ({ input, ...rest }: any) => {
  const { value } = input;

  return <Select {...input} {...rest} value={{ value, label: value }} />;
};

const mapStateToProps = (state: AppState) => ({
  data: getData(state),
  filters: filterSelector(state),
  isLoading: isLoadingSelector(state)
});

export default connect(
  mapStateToProps,
  { loadFilters }
)(EnhancedTableBody);
