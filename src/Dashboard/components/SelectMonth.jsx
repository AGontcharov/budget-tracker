// @flow
import * as React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Helper Functions
import { MONTHS } from 'lib/constants';

type Props = {
  availableMonths: Array<number>,
  classes: {
    form: string
  },
  month: number,
  onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void
};

const styles = {
  form: {
    width: 150
  }
};

const SelectMonth = (props: Props) => {
  const { availableMonths, classes, month, onChange } = props;

  return (
    <FormControl className={classes.form}>
      <InputLabel>Month</InputLabel>
      <Select value={month} onChange={onChange}>
        {availableMonths.map(month => {
          return (
            <MenuItem id={month} key={month} value={month}>
              {MONTHS[month]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default withStyles(styles)(SelectMonth);
