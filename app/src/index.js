import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'

// eslint-disable-next-line import/named
import configureStore, { history } from './store/configureStore'

// Import all of our components
import App from './App'

const store = configureStore()

// remove our token
// eslint-disable-next-line no-undef
window.sessionStorage.removeItem('user')

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
)
