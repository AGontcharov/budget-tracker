import React from 'react';

import { DatePicker } from '@material-ui/pickers';

type Props = {
  input: any;
  meta: any;
};

const FinalDatePicker = (props: Props) => {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props;

  return (
    <DatePicker
      {...rest}
      name={name}
      format="MMM E dd yyyy"
      onChange={onChange}
      value={value === '' ? null : value}
    />
  );
};

export default FinalDatePicker;
