// @flow
import * as React from 'react';

// Material UI
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

// Helper Functions
import { MONTHS } from 'lib/constants';

type Props = {
  availableMonths: Array<number>,
  month: number,
  onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void
};

class SelectMonth extends React.Component<Props> {
  render() {
    const { availableMonths, month, onChange } = this.props;

    const styles = {
      form: {
        width: 150
      }
    };

    return (
      <FormControl style={styles.form}>
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
  }
}

export default SelectMonth;
