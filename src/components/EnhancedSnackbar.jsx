// @flow
import React from 'react';
import { withTheme } from '@material-ui/core/styles';

// Material UI
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
  message: string,
  open: boolean,
  theme: Object,
  variant: string
};

type State = {
  open: boolean
};

class EnhancedSnackbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: props.open
    };
  }

  onClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { message, theme, variant } = this.props;
    const { open } = this.state;

    // TODO: Look over colors later
    const styles = {
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
    };

    const Icon = variantIcon[variant];

    return (
      <Snackbar autoHideDuration={6000} open={open} onClose={this.onClose}>
        <SnackbarContent
          message={
            <span style={{ ...styles.message }}>
              <Icon style={{ ...styles.icon, ...styles.iconVariant }} />
              {message}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={this.onClose}>
              <CloseIcon />
            </IconButton>
          ]}
          style={styles[variant]}
        />
      </Snackbar>
    );
  }
}

export default withTheme()(EnhancedSnackbar);
