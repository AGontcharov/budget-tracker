import { combineReducers } from 'redux';

// Reducers
import transactions, { initialState as dataInitialState } from 'ducks/data';

const rootReducer = combineReducers({ transactions });

export const initialStoreState = {
  transactions: dataInitialState
};

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;
