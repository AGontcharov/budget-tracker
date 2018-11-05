// @flow

// Helper Functions
import rawData from 'lib/RawData';

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
  filters: Array<{ name: string, value: string }>
};

const LOAD = 'LOAD';
const LOAD_FILTERS = 'LOAD_FILTERS';

export const initialState = {
  data: [],
  // data: rawData,
  filters: []
};

// Reducer
export default (state: InitialState = initialState, action: Action) => {
  switch (action.type) {
    case LOAD:
      return { ...state, data: action.payload };
    case LOAD_FILTERS:
      return { ...state, filters: action.payload };
    default:
      return state;
  }
};

// Action Creator
export const loadData = (data: Array<Transaction>) => {
  return { type: LOAD, payload: data };
};

export const loadFilters = (data: Array<{ name: string, value: string }>) => {
  return { type: LOAD_FILTERS, payload: data };
};

// Selectors
// TODO: Flow error
export const getFilteredData = transactions => {
  const filteredData = transactions.filters.reduce((filteredSoFar, nextFilter) => {
    return filteredSoFar.filter(row => {
      return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
    });
  }, transactions.data);

  return filteredData;
};
