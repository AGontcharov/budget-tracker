// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

const layout = (props: Props) => {
  const styles = {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  return <div style={styles}>{props.children}</div>;
};

export default layout;
