import { applyMiddleware, combineReducers, legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "@reduxjs/toolkit/dist/devtoolsExtension";
import createSagaMiddleware from 'redux-saga';
import { notificationReducer } from './mainReducer';
import { rootSaga } from '../reduxSaga/rootSaga';


const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  notification: notificationReducer,
})

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga);

export default store;
