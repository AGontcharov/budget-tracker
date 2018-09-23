// @flow
import * as React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

type Props = {};

const FileDownload = (props: Props) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M19,9 L15,9 L15,3 L9,3 L9,9 L5,9 L12,16 L19,9 Z M5,18 L5,20 L19,20 L19,18 L5,18 Z"
        id="path-1"
      />
    </SvgIcon>
  );
};

export default FileDownload;
