import React, { useCallback } from 'react';
import { Form, Field } from 'react-final-form';

// Custom Components
import FinalTextField from 'components/Form/FinalTextField';

// Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';

const isRequired = (value: string) => {
  return !value ? 'Required' : undefined;
};

type Props = {
  onClose: () => void;
};

const Login = (props: Props) => {
  const { onClose } = props;

  const onSubmit = useCallback(
    async (values: { username?: string; password?: string }) => {
      try {
        console.log(values);
        const response = await fetch('/login', { method: 'POST' });
        console.log(response);
      } catch (error) {}
      onClose();
    },
    [onClose]
  );

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="Login"
      aria-describedby="Login to your account"
      fullWidth
      maxWidth="xs"
    >
      <Form onSubmit={onSubmit} subscription={{ pristine: true, submitting: true, valid: true }}>
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
                  label="Username"
                  margin="normal"
                  required
                  validate={isRequired}
                  variant="outlined"
                />

                <Field
                  name="password"
                  component={FinalTextField}
                  type="password"
                  label="password"
                  fullWidth
                  margin="normal"
                  required
                  validate={isRequired}
                  variant="outlined"
                />

                <br />
                <br />

                <DialogContentText>
                  {'Not registered?'}
                  &nbsp;
                  <Link href="">{'Create an Account'}</Link>
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
    </Dialog>
  );
};

export default Login;
