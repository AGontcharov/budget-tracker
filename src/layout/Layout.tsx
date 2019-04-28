import React, { ReactNode } from 'react';

// Material UI
import { withStyles, createStyles } from '@material-ui/core/styles';

type Props = {
  children: ReactNode;
  classes: {
    root: string;
  };
};

const styles = createStyles({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
});

const layout = (props: Props) => {
  return <div className={props.classes.root}>{props.children}</div>;
};

export default withStyles(styles)(layout);
