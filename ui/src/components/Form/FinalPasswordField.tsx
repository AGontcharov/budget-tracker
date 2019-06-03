import React, { useState } from 'react';

// Material UI
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// TODO: Proper TypeScript
type FinalTextFieldProps = {
  input: any;
  meta: any;
  InputProps?: any;
};

const FinalTextField = ({
  input: { name, onChange, value, ...restInput },
  meta,
  InputProps,
  ...rest
}: FinalTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

  const onShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
      {...rest}
      autoComplete="off"
      error={showError}
      helperText={showError ? meta.error || meta.submitError : undefined}
      // This was causing Material UI TextField to lose the focus behavior
      // inputProps={restInput}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="Toggle password visibility" onClick={onShowPassword}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
        ...InputProps,
        ...restInput,
        type: showPassword ? 'text' : 'password'
      }}
      name={name}
      onChange={onChange}
      value={value}
    />
  );
};

export default FinalTextField;
