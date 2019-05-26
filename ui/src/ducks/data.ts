// Helper Functions
import rawData from 'lib/RawData';
import { getSorting, stableSort } from 'lib/Utils';

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
  data: [],
  // data: rawData,
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
// TODO: Maybe we can combine this...
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
export const getData = (transactions: InitialState): Array<Transaction> => {
  const { data, filters, sort } = transactions;

  const sortedData: Array<Transaction> = stableSort(data, getSorting(sort.order, sort.orderBy));

  const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
    return filteredSoFar.filter(row => {
      return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
    });
  }, sortedData);

  return filteredData;
};

// TODO: Keep it around for now
export const getFilteredData = (transactions: InitialState): Array<Transaction> => {
  const { data, filters } = transactions;

  const filteredData = filters.reduce((filteredSoFar, nextFilter) => {
    return filteredSoFar.filter(row => {
      return (row[nextFilter.name] + '').toLowerCase().includes(nextFilter.value.toLowerCase());
    });
  }, data);

  return filteredData;
};
