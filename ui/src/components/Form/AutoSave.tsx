import React, { useEffect, useRef } from 'react';
import { FormSpy } from 'react-final-form';

export interface Values {
  id: number;
  date: Date;
  type: string;
  category: string;
  details: string;
  description: string;
  price: string;
  [key: string]: number | Date | string;
}

type Props = {
  values: Values;
  save: (values: Values) => void;
};

const AutoSave = (props: Props) => {
  const { values, save } = props;
  const didMountRef = useRef(false);

  const difference = JSON.stringify(values);

  // console.log(values);

  useEffect(() => {
    if (didMountRef.current) {
      console.log('saving...');
      save(values);
    } else {
      didMountRef.current = true;
    }
  }, [difference]);

  return null;
};

export default (props: { debounce: number; save: (values: Values) => void }) => {
  return <FormSpy {...props} subscription={{ values: true }} component={AutoSave as any} />;
};
