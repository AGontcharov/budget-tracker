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
    wrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 75,
      background: props.theme.palette.accent.main
    },
    copyRight: {
      fontSize: 13
    }
  };

  return (
    <div style={styles.wrapper}>
      <Typography style={styles.copyRight}>
        Copyright © {new Date().getFullYear()} Alexander Gontcharov. All right reserved.
      </Typography>
    </div>
  );
};

export default withTheme()(Footer);
