// @flow
import * as React from 'react';

// Material UI
import Input from '@material-ui/core/Input';

type Props = {
  onChange: (event: SyntheticInputEvent<HTMLInputElement>) => void
};

const StringFilter = (props: Props) => {
  const styles = {
    fontSize: 14
  };

  return (
    <Input
      placeholder="Search..."
      inputProps={{ 'aria-label': 'Description' }}
      onChange={props.onChange}
      style={styles}
    />
  );
};

export default StringFilter;
