import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import loginReducer from './login'
import clientesReducer from './clientes'
import modalReducer from './modal'

const reducer = (history) => combineReducers({
  login: loginReducer,
  clientes: clientesReducer,
  modal: modalReducer,
  router: connectRouter(history),
})

export default reducer
