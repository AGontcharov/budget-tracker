// @flow
import * as React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';

type Props = {
  onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void
};

const styles = {
  fontSize: 14
};

const StringFilter = (props: Props) => (
  <Input
    placeholder="Search..."
    inputProps={{ 'aria-label': 'Description' }}
    onChange={props.onChange}
    className={props.classes.root}
  />
);

export default withStyles(styles)(StringFilter);
