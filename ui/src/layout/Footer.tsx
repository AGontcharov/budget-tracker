import React from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    background: theme.palette.accent.main
  },
  copyRight: {
    fontSize: 13
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.copyRight}>
        {`Copyright © ${new Date().getFullYear()} Alexander Gontcharov. All right reserved.`}
      </Typography>
    </div>
  );
};

export default React.memo(Footer);
