import React from 'react';

// Material UI
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

type Props = {
  classes: {
    wrapper: string;
    copyRight: string;
  };
};

const styles = ({ palette }: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 75,
      background: palette.accent.main
    },
    copyRight: {
      fontSize: 13
    }
  });

const Footer = (props: Props) => {
  const { classes } = props;

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.copyRight}>
        Copyright © {new Date().getFullYear()} Alexander Gontcharov. All right reserved.
      </Typography>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Footer);
