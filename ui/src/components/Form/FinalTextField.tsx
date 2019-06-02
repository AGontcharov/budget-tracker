import React from 'react';

// Material UI
import TextField from '@material-ui/core/TextField';

// TODO: Proper TypeScript
type FinalTextFieldProps = {
  input: any;
  meta: any;
};

const FinalTextField = ({
  input: { name, onChange, value, ...restInput },
  meta,
  ...rest
}: FinalTextFieldProps) => {
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  return (
    <TextField
      autoComplete="off"
      name={name}
      error={showError}
      helperText={showError ? meta.error || meta.submitError : undefined}
      inputProps={restInput}
      onChange={onChange}
      value={value}
      {...rest}
    />
  );
};

export default FinalTextField;
