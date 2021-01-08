import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import PropTypes from 'prop-types'

import './index.css'

import Login from './containers/Login/Login'
import Home from './containers/Home/Home'

const App = ({ history }) => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
    </Switch>
  </ConnectedRouter>
)

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
}

export default App
