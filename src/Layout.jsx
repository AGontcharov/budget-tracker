// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

const layout = (props: Props) => {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {props.children}
    </div>
  );
};

export default layout;
