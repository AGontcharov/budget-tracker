import { createStore } from 'redux';
import data from 'ducks/data';

const store = createStore(data);

export default store;
