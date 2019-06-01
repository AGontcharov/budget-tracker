import React, { ChangeEvent } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Helper Functions
import { MONTHS } from 'lib/constants';

type Props = {
  availableMonths: Array<number>;
  month: number;
  onChange: (event: ChangeEvent<{ name?: string; value: unknown }>) => void;
};

const useStyles = makeStyles({
  form: {
    width: 150
  }
});

const SelectMonth = (props: Props) => {
  const { availableMonths, month, onChange } = props;
  const classes = useStyles();

  return (
    <FormControl className={classes.form}>
      <InputLabel>{'Month'}</InputLabel>
      <Select value={month} onChange={onChange}>
        {availableMonths.map(month => {
          return (
            <MenuItem id={month.toString()} key={month} value={month}>
              {MONTHS[month]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectMonth;
