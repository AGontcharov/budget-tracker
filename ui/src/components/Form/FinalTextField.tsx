import React from 'react';

// Material UI
import TextField from '@material-ui/core/TextField';

// TODO: Proper TypeScript
type FinalTextFieldProps = {
  input: any;
  meta: any;
  InputProps?: any;
  inputProps?: any;
};

const FinalTextField = ({
  input: { name, onChange, value, ...restInput },
  meta,
  InputProps,
  inputProps,
  ...rest
}: FinalTextFieldProps) => {
  return (
    <TextField
      name={name}
      InputProps={{ ...InputProps, ...restInput }}
      inputProps={inputProps}
      onChange={onChange}
      value={value}
      {...rest}
    />
  );
};

export default FinalTextField;
