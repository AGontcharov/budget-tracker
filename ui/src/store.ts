import { createStore } from 'redux';
import rootReducer, { initialStoreState } from 'ducks';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducer, initialStoreState as any, composeWithDevTools());

export default store;
