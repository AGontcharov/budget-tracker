// @flow

// Helper Functions
import rawData from 'lib/RawData';
// import { stableSort } from 'lib/Utils';

export type Filter = { name: string, value: string };
// TODO: Review flow type
export type Sort = { orderBy: string, order: 'acs' | 'desc' };
export type Transaction = {
  id: number,
  date: Date,
  type: string,
  category: string,
  details: string,
  price: number
};

type Action = { type: string, payload: any };
type InitialState = {
  data: Array<Transaction>,
  filters: Array<Filter>,
  sort: Sort
};

const LOAD = 'LOAD';
const LOAD_FILTERS = 'LOAD_FILTERS';
const LOAD_ORDER = 'LOAD_ORDER';

export const initialState = {
  // data: [],
  data: rawData,
  filters: [],
  sort: {}
};

// Reducer
export default (state: InitialState = initialState, action: Action) => {
  switch (action.type) {
    case LOAD:
      return { ...state, data: action.payload };
    case LOAD_FILTERS:
      return { ...state, filters: action.payload };
    case LOAD_ORDER:
      return { ...state, sort: action.payload };
    default:
      return state;
  }
};

// Action Creator
export const loadData = (data: Array<Transaction>) => {
  return { type: LOAD, payload: data };
};

export const loadFilters = (data: Array<Filter>) => {
  return { type: LOAD_FILTERS, payload: data };
};

export const loadSort = (data: Sort) => {
  return { type: LOAD_ORDER, payload: data };
};

// Selectors
// TODO: Sorted + Filtered Data selector
// export const getData = (transactions: InitialState) => {
//   const { data, filters, sort } = transactions;
// };

export const getFilteredData = (transactions: InitialState): Array<Transaction> => {
  const { data, filters } = transactions;

  const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
    return filteredSoFar.filter(row => {
      return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
    });
  }, data);

  return filteredData;
};
