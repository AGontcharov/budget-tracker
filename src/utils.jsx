export const rows = [
  { id: 'date', numeric: false, disablePadding: false, label: 'Date of Transaction' },
  { id: 'type', numeric: false, disablePadding: false, label: 'Transcation Type' },
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'details', numeric: false, disablePadding: false, label: 'Details' },
  { id: 'price', numeric: true, disablePadding: false, label: 'Price $ (CAD)' }
];

export const desc = (a, b, orderBy) => {
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

export const stableSort = (array, cmp) => {
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
export const getSorting = (order, orderBy) => {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
};
