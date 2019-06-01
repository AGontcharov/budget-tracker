import React, { ReactNode } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  children: ReactNode;
};

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
});

const Layout = ({ children }: Props) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};

export default Layout;
