import {combineReducers} from 'redux';
import OutletReducer from './outletReducer';
import ErrorReducer from './errorReducer';

const allReducers = combineReducers({
  repo: OutletReducer,
  error: ErrorReducer
});

export default allReducers;
