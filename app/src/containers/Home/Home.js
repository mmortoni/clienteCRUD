/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container } from 'reactstrap'

import '../../App.css'
import AppNavbar from '../../components/AppNavbar'

import ClientesGrid from '../Cliente/ClientesGrid'
import ClientesView from '../../components/Cliente/ClientesView'

import { Creators as clientesActions } from '../../store/ducks/clientes'
import { Creators as loginActions } from '../../store/ducks/login'
import Messages from '../../services/notifications/Messages'
import Errors from '../../services/notifications/Errors'
import { user, cliente, message } from '../../utils/proptypes'

class Home extends Component {
  constructor (props) {
    super(props)
    const { user, history } = this.props

    if (!user) {
      history.push('/login')
    }

    this.logout = this.logout.bind(this)
  }

  componentDidMount () {
    const { user, history, requestAll } = this.props

    if (!user) {
      history.push('/login')
    } else {
      const { user } = this.props

      // get data
      requestAll(user)
    }
  }

  componentWillUnmount () {
    window.sessionStorage.removeItem('user')
  }

  logout () {
    const { history, logout } = this.props

    // logout no server
    window.sessionStorage.removeItem('user')
    logout()
    history.push('/login')
  }

  render () {
    const {
      clientes,
      isLoaded,
      messages,
      errors,
      user,
    } = this.props
    const message = user
      // eslint-disable-next-line react/jsx-one-expression-per-line
      ? <h2>Bem-vindo, {user.userName}!</h2>
      : <div>Por favor, faça o login!</div>
    const isADMIN = user ? user.roles.indexOf('ADMIN') > -1 : false
    const isUSER = user ? user.roles.indexOf('ADMIN') === -1 : false

    return (
      <div>
        <AppNavbar logout={this.logout} />

        <Container fluid>
          {message}
          {isADMIN && isLoaded && <ClientesGrid user={user} />}
          {isUSER && isLoaded && <ClientesView user={user} clientes={clientes} />}
        </Container>

        {/* We're just using the message and error helpers */}
        {errors.length > 0 && (
          <Errors message="Failure to request due to:" errors={errors} />
        )}
        {messages.length > 0 && (
          <Messages messages={messages} />
        )}
      </div>
    )
  }
}

Home.propTypes = {
  requestAll: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  clientes: PropTypes.arrayOf(PropTypes.shape(cliente)).isRequired,
  isLoaded: PropTypes.bool.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape(message)).isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape(message)),
  user: PropTypes.shape(user),
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
}

// Grab only the piece of state we need
const mapStateToProps = (state) => ({
  clientes: state.clientes.list,
  isLoaded: state.clientes.isLoaded,
  messages: state.clientes.messages,
  errors: state.clientes.errors,
  user: JSON.parse(window.sessionStorage.getItem('user')),
})

// eslint-disable-next-line max-len
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...clientesActions, ...loginActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)
