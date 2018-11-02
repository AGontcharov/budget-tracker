// @flow
import * as React from 'react';
import { withTheme } from '@material-ui/core/styles';

// Material UI
import Typography from '@material-ui/core/Typography';

type Props = {
  theme: Object
};

const Footer = (props: Props) => {
  const styles = {
    height: 100,
    background: props.theme.palette.accent.main
  };

  return (
    <div style={styles}>
      <Typography variant="body1" align="center">
        Footer goes here
      </Typography>
    </div>
  );
};

export default withTheme()(Footer);
