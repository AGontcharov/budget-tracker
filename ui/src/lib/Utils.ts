export const desc = (a: any, b: any, orderBy: string) => {
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

export const stableSort = (array: Array<any>, compare: Function): Array<any> => {
  const stabilizedThis = array.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = compare(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
};

// Curry function
// If descending return desc(a, b, orderBy)
// Otherwise, return -desc(a, b, orderBy)
export const getSorting = (order: string, orderBy: string) => {
  return (a: any, b: any) => {
    // Sort empty strings to the bottom of the list
    if (a[orderBy] === '' || a[orderBy] === null) return 1;
    if (b[orderBy] === '' || b[orderBy] === null) return -1;

    return order === 'desc' ? desc(a, b, orderBy) : -desc(a, b, orderBy);
  };
};

export const parseNumber = (value: string) => {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 0;
  }
  return number;
};
