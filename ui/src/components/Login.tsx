import React, { useCallback, useState } from 'react';
import { Form, Field } from 'react-final-form';

// Custom Components
import FinalTextField from 'components/Form/FinalTextField';
import FinalPasswordField from 'components/Form/FinalPasswordField';

// Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';

const composeValidators = (...validators: Array<any>) => (value: string, allValues: Object) => {
  return validators.reduce((error, validator) => error || validator(value, allValues), undefined);
};

const isRequired = (value: string) => {
  return !value ? 'Required' : undefined;
};

const isEqual = (name: string) => (value: string, allValues: any) => {
  return value !== allValues[name] ? 'Password does not match' : undefined;
};

type Props = {
  onClose: () => void;
};

const Login = ({ onClose }: Props) => {
  const [isRegister, setRegister] = useState(false);

  const onSubmit = useCallback(
    async (values: { username?: string; password?: string }) => {
      try {
        const response = isRegister
          ? await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            })
          : await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            });

        if (!response.ok) {
          throw response;
        }

        console.log(await response.json());
        onClose();
      } catch (error) {
        console.log(await error.json());
      }
    },
    [onClose, isRegister]
  );

  const toggleRegistration = useCallback(() => {
    setRegister(!isRegister);
  }, [isRegister]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby={isRegister ? 'Sign Up' : 'Login'}
      aria-describedby={isRegister ? 'Create an account' : 'Login to your account'}
      fullWidth
      maxWidth="xs"
    >
      {isRegister ? (
        <Form
          key="register"
          onSubmit={onSubmit}
          subscription={{ pristine: true, submitting: true, valid: true }}
        >
          {({ handleSubmit, pristine, submitting, valid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogTitle>{'Create an account'}</DialogTitle>
                <DialogContent>
                  <Field
                    autoFocus
                    name="username"
                    component={FinalTextField}
                    fullWidth
                    label="Username or Email"
                    margin="normal"
                    required
                    validate={isRequired}
                    variant="outlined"
                  />

                  <Field
                    name="password"
                    component={FinalTextField}
                    type="password"
                    label="Password"
                    fullWidth
                    margin="normal"
                    required
                    validate={isRequired}
                    variant="outlined"
                  />

                  <Field
                    name="confirmPassword"
                    component={FinalTextField}
                    type="password"
                    label="Confirm Password"
                    fullWidth
                    margin="normal"
                    required
                    validate={composeValidators(isRequired, isEqual('password'))}
                    variant="outlined"
                  />

                  {/* TODO: Better way to break up space? */}
                  <br />
                  <br />

                  <DialogContentText>
                    {'Already have an account?'}
                    &nbsp;
                    <Link
                      component="button"
                      type="button"
                      onClick={toggleRegistration}
                      variant="body1"
                    >
                      {'Login'}
                    </Link>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClose} color="primary">
                    {'Cancel'}
                  </Button>
                  <Button color="primary" disabled={pristine || submitting || !valid} type="submit">
                    {'Create'}
                  </Button>
                </DialogActions>
              </form>
            );
          }}
        </Form>
      ) : (
        <Form
          key="login"
          onSubmit={onSubmit}
          subscription={{ pristine: true, submitting: true, valid: true }}
        >
          {({ handleSubmit, pristine, submitting, valid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogTitle>{'Login to your Budget Tracker'}</DialogTitle>
                <DialogContent>
                  <Field
                    autoFocus
                    name="username"
                    component={FinalTextField}
                    fullWidth
                    label="Username or Email"
                    margin="normal"
                    required
                    validate={isRequired}
                    variant="outlined"
                  />

                  <Field
                    name="password"
                    component={FinalPasswordField}
                    label="password"
                    fullWidth
                    margin="normal"
                    required
                    validate={isRequired}
                    variant="outlined"
                  />

                  {/* TODO: Better way to break up space? */}
                  <br />
                  <br />

                  <DialogContentText>
                    {'Not registered?'}
                    &nbsp;
                    <Link
                      component="button"
                      type="button"
                      onClick={toggleRegistration}
                      variant="body1"
                    >
                      {'Create an Account'}
                    </Link>
                  </DialogContentText>
                </DialogContent>

                <DialogActions>
                  <Button onClick={onClose} color="primary">
                    {'Cancel'}
                  </Button>
                  <Button color="primary" disabled={pristine || submitting || !valid} type="submit">
                    {'Login'}
                  </Button>
                </DialogActions>
              </form>
            );
          }}
        </Form>
      )}
    </Dialog>
  );
};

export default Login;
