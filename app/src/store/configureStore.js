import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

import reducers from './ducks'
import rootSaga from './sagas'

export const history = createBrowserHistory()

export default function configureStore (preloadedState) {
  // create middlewares
  const sagaMiddleware = createSagaMiddleware()

  /*eslint-disable */
  const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
  /* eslint-enable */

  const store = createStore(
    reducers(history),
    preloadedState,
    composeSetup(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
      ),
    ),
  )

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./ducks', () => {
      store.replaceReducer(routerMiddleware(history))
    })
  }

  sagaMiddleware.run(rootSaga)

  return store
}
