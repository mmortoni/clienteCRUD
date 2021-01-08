import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'

import { Creators as loginActions } from '../../store/ducks/login'
import Messages from '../../services/notifications/Messages'
import Errors from '../../services/notifications/Errors'
import { message } from '../../utils/proptypes'

class Login extends Component {
  constructor (props) {
    super(props)

    this.onSubmitLogin = this.onSubmitLogin.bind(this)
  }

  onSubmitLogin (event) {
    event.preventDefault()

    const userName = event.target.userName.value
    const password = event.target.password.value
    const { requestLogin } = this.props

    if (userName.length < 3 || password.length < 6) {
      return false
    }

    const data = `{"userName": "${userName}", "password": "${password}"}`
    requestLogin(JSON.parse(data))
    return true
  }

  render () {
    const {
      messages, errors, isLoggedIn, className,
    } = this.props

    if (isLoggedIn) {
      return <Redirect to="/home" />
    }

    return (
      <div>
        <Modal isOpen={!isLoggedIn} className={className}>
          <ModalHeader>Login</ModalHeader>

          <ModalBody>
            <Form onSubmit={this.onSubmitLogin}>
              <FormGroup>
                <Label for="usernameId">Usuário</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="userName"
                    id="userNameId"
                    placeholder="Informe o nome do usuário"
                    autoFocus
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label for="passwordId">Senha</Label>
                <InputGroup>
                  <Input
                    type="password"
                    name="password"
                    id="passwordId"
                    placeholder="Informe a senha"
                    required
                  />
                </InputGroup>
              </FormGroup>
              <hr />
              <Button color="primary" value="login">Login</Button>
              {'   '}
            </Form>
          </ModalBody>

          <ModalFooter>
            {/* We're just using the message and error helpers */}
            {errors.length > 0 && (
              <Errors message="Failure to login due to:" errors={errors} />
            )}
            {messages.length > 0 && (
              <Messages messages={messages} />
            )}
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

Login.propTypes = {
  requestLogin: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  className: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.shape(message)).isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape(message)),
}

// Grab only the piece of state we need
const mapStateToProps = (state) => ({
  user: state.login.user,
  messages: state.login.messages,
  errors: state.login.errors,
  isLoggedIn: Object.entries(state.login.user).length > 0,
})

const mapDispatchToProps = (dispatch) => bindActionCreators(loginActions, dispatch)

// make Redux state piece of `login` and our action `requestLogin`
// available in this.props within our component
export default connect(mapStateToProps, mapDispatchToProps)(Login)
