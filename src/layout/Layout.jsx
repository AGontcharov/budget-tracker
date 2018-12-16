// @flow
import * as React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';

type Props = {
  children: React.Node,
  classes: {
    root: string
  }
};

const styles = {
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
};

const layout = (props: Props) => {
  return <div className={props.classes.root}>{props.children}</div>;
};

export default withStyles(styles)(layout);
