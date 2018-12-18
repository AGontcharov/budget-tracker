// @flow
import React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

type Props = {
  classes: {
    error: string,
    info: string,
    icon: string,
    iconVariant: string,
    message: string
  },
  message: string,
  onClose: () => void,
  open: boolean,
  variant: string
};

// TODO: Look over colors later
const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

const EnhancedSnackbar = (props: Props) => {
  const { classes, message, onClose, open, variant } = props;
  const Icon = variantIcon[variant];

  return (
    <Snackbar autoHideDuration={6000} open={open} onClose={onClose}>
      <SnackbarContent
        message={
          <span className={classes.message}>
            <Icon className={`${classes.icon}, ${classes.iconVariant}`} />
            {message}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ]}
        className={classes[variant]}
      />
    </Snackbar>
  );
};

export default withStyles(styles, { withTheme: true })(EnhancedSnackbar);
