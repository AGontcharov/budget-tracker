import { createSelector } from 'reselect';

// Helper Functions
import rawData from 'lib/RawData';
import { getSorting, stableSort } from 'lib/Utils';

import { AppState } from 'ducks';

export interface Filter {
  name: string;
  value: string;
}

export interface Sort {
  orderBy: string;
  // order: 'asc' as 'asc' | 'desc' as '';
  order: string;
}

export interface Transaction {
  id: number;
  date: Date;
  type: string;
  category: string;
  details: string;
  description: string;
  price: number;
  [key: string]: number | Date | string;
}

interface Action {
  type: string;
  payload: any;
}

interface InitialState {
  data: Array<Transaction>;
  isLoading: boolean;
  filters: Array<Filter>;
  sort: Sort;
}

const IS_LOADING = 'IS_LOADING';
const LOAD = 'LOAD';
const LOAD_FILTERS = 'LOAD_FILTERS';
const LOAD_ORDER = 'LOAD_ORDER';

export const initialState = {
  // data: [],
  data: rawData,
  isLoading: false,
  filters: [],
  sort: { orderBy: 'date', order: 'asc' }
};

// Reducer
export default (state: InitialState = initialState, action: Action) => {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: action.payload };
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
export const isLoading = (payload: boolean) => {
  return { type: IS_LOADING, payload };
};

export const loadData = (payload: Array<Transaction>) => {
  return { type: LOAD, payload };
};

export const loadFilters = (payload: Array<Filter>) => {
  return { type: LOAD_FILTERS, payload };
};

export const loadSort = (payload: Sort) => {
  return { type: LOAD_ORDER, payload };
};

// Selectors
export const dataSelector = (state: AppState) => state.transactions.data;
export const filterSelector = (state: AppState) => state.transactions.filters;
export const orderSelector = (state: AppState) => state.transactions.sort.order;
export const orderBySelector = (state: AppState) => state.transactions.sort.orderBy;

// This memoized selector is used to retrieve the data with sorting and filters applied
export const getData = createSelector(
  [dataSelector, filterSelector, orderSelector, orderBySelector],
  (data: Array<Transaction>, filters: Array<Filter>, order, orderBy) => {
    const sortedData: Array<Transaction> = stableSort(data, getSorting(order, orderBy));

    const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
      return filteredSoFar.filter(row => {
        return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
      });
    }, sortedData);

    return filteredData;
  }
);

// This memoized selector is used to get the filtered data without any sorting applied.
// Used in the dashboard as sorting is not important.
export const getFilteredData = createSelector(
  [dataSelector, filterSelector],
  (data: Array<Transaction>, filters: Array<Filter>) => {
    const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
      return filteredSoFar.filter(row => {
        return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
      });
    }, data);

    return filteredData;
  }
);
