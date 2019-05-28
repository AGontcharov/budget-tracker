import React from 'react';
import { Form, Field } from 'react-final-form';

// Custom Components
import AutoSave from 'components/Form/AutoSave';
import FinalTextField from 'components/Form/FinalTextField';

// Material UI
import { withStyles, createStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// Custom Components
import Select from 'budgetTable/components/Select';

// TypeScript
import { Transaction } from 'ducks/data';
import { Values } from 'components/Form/AutoSave';

type Props = {
  classes: {
    input: string;
    priceInput: string;
  };
  row: Transaction;
  onCategoryChange: (index: number) => (value: string) => void;
  onSave: (values: Values) => void;
};

const styles = () =>
  createStyles({
    input: {
      fontSize: 13
    },
    priceInput: {
      textAlign: 'right'
    }
  });

const EnhancedTableRow = ({ classes, row, onCategoryChange, onSave }: Props) => {
  return (
    <TableRow>
      <Form onSubmit={() => {}} initialValues={row} subscription={{}}>
        {() => (
          <>
            {/* TODO: Debounce prop not used  */}
            <AutoSave debounce={1000} save={onSave} />

            {/* Date */}
            <TableCell padding="dense">
              <Field
                name="date"
                component={FinalTextField}
                format={value => value.toDateString()}
                parse={value => new Date(value)}
                value="date"
                fullWidth
                InputProps={{ className: classes.input, disableUnderline: true }}
              />
            </TableCell>

            {/* Type */}
            <TableCell padding="dense">
              <Field
                name="type"
                component={FinalTextField}
                value="type"
                fullWidth
                InputProps={{ className: classes.input, disableUnderline: true }}
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
                InputProps={{ className: classes.input, disableUnderline: true }}
              />
            </TableCell>

            {/* Descriptions */}
            <TableCell padding="dense">
              <Field
                name="description"
                component={FinalTextField}
                value="description"
                fullWidth
                InputProps={{ className: classes.input, disableUnderline: true }}
              />
            </TableCell>

            {/* Price */}
            <TableCell padding="dense">
              <Field
                name="price"
                component={FinalTextField}
                value="price"
                fullWidth
                InputProps={{ className: classes.input, disableUnderline: true }}
                inputProps={{ className: classes.priceInput }}
              />
            </TableCell>
          </>
        )}
      </Form>
    </TableRow>
  );
};

export default withStyles(styles)(EnhancedTableRow);
