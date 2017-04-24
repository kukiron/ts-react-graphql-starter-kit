import * as React from "react";
import * as ReactDom from "react-dom";
import createSagaMiddleware from "redux-saga";

import App from "../modules/client";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";

import { rootSaga } from "../modules/client/sagas";
import { rootReducer } from "../modules/client/reducers";

import '../modules/client/styles/main.scss';

import { routerReducer, routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory';

const history = createHistory()

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose
      || compose;
const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware),
  applyMiddleware(routerMiddleware(history))
);

let routingReducer = (s:any, e:any) => {
  let state = rootReducer(s,e);
  return {...state, router: routerReducer(s && s.router, e)};
}

let store = createStore(
  routingReducer,
  enhancer
);

sagaMiddleware.run(rootSaga);

ReactDom.render(
  <Provider store={store}>
     <App history={history}/>
  </Provider>,
  document.getElementById("msl-app"),
);