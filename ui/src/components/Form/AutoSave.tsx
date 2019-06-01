import { useEffect, useRef } from 'react';

// Helper Functions
import { parseNumber } from 'lib/Utils';

// TypeScript
import { Transaction } from 'ducks/data';

type Values = {
  id: number;
  date: Date;
  type: string;
  category: string;
  details: string;
  description: string;
  price: string;
  [key: string]: number | Date | string;
};

type Props = {
  // TODO: Fix type
  values: any;
  save: (values: Transaction) => void;
};

const AutoSave = ({ values, save }: Props) => {
  const formattedValues = { ...values, price: parseNumber(values.price) };
  const difference = JSON.stringify(formattedValues);

  // Prevent side effects from occurring twice on initial mount
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      save(formattedValues);
    } else {
      didMountRef.current = true;
    }
    // eslint-disable-next-line
  }, [difference]);

  return null;
};

export default AutoSave;
