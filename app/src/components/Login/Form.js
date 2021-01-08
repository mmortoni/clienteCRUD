import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
import ErrorMessage from '../../services/notifications/Messages'
import { data } from '../../utils/proptypes'

class FormCliente extends Component {
  constructor (props) {
    super(props)

    this.state = {
      modal: true,
    }

    this.onSubmitCliente = this.onSubmitCliente.bind(this)
  }

  onSubmitCliente (event) {
    event.preventDefault()
    const { data, onSubmit } = this.props

    onSubmit(data.username, data.password)

    this.setState({
      modal: false,
    })
  }

  render () {
    const { error, className } = this.props
    const { modal } = this.state

    return (
      <div>
        <Modal isOpen={modal} className={className}>
          <ModalHeader>Login</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmitCliente}>
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

              { error && <div>{error}</div> }

              <hr />
              <Button color="primary" value="login">Login</Button>
              {'   '}
              <Button onClick={this.modalClose} color="secondary" value="cancel">Cancelar</Button>
            </Form>
          </ModalBody>
          <ModalFooter>
            {error ? <ErrorMessage error={error} /> : null}
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

FormCliente.propTypes = {
  data: PropTypes.shape(data),
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
}

export default FormCliente
