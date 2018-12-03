// @flow

// Flow Type
import type { Transaction } from 'ducks/data';

export const headers = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    tooltip: 'Date of Transaction'
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
    tooltip: 'The category which the transaction falls under'
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Category',
    tooltip: 'The category of the transaction'
  },
  {
    id: 'details',
    numeric: false,
    disablePadding: false,
    label: 'Details',
    tooltip: 'More information about the transaction'
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price $ (CAD)',
    tooltip: 'The price of the transaction'
  }
];

export const desc = (a: Transaction, b: Transaction, orderBy: string) => {
  // a gets sorted to an index lower than b i.e. a comes first
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  // b gets sorted to an index lower than a i.e. b comes first
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  // a and b stay at the same index
  return 0;
};

export const stableSort = (array: Array<Transaction>, cmp: Function) => {
  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
};

// Curry function
// If descending return desc(a, b, orderBy)
// Otherwise, return -desc(a, b, orderBy)
export const getSorting = (order: string, orderBy: string) => {
  return order === 'desc'
    ? (a: Transaction, b: Transaction) => desc(a, b, orderBy)
    : (a: Transaction, b: Transaction) => -desc(a, b, orderBy);
};
