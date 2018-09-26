// @flow

export type Transaction = {
  id: number,
  date: string,
  type: string,
  category: string,
  details: string,
  price: number
};

const LOAD = 'LOAD';

export const initialState = {
  data: []
};

// Reducer
export default (
  state: { data: Array<?Transaction> } = initialState,
  action: { type?: string, payload?: any } = {}
) => {
  switch (action.type) {
    case LOAD:
      return { data: action.payload };
    default:
      return state;
  }
};

// Action Creator
export const loadData = (data: Array<Transaction>) => {
  return { type: LOAD, payload: data };
};
