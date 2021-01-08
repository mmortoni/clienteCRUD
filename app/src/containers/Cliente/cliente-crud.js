import React, { Component } from 'react'
import update from 'react-addons-update'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import {
  Col,
  Row,
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
}
  from 'reactstrap'
import axios from 'axios'
import BootstrapTable from 'react-bootstrap-table-next'
import InputMask from 'react-input-mask'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import { Creators as clientesActions } from '../../store/ducks/clientes'
import { Creators as modalActions } from '../../store/ducks/modal'

import Messages from '../../services/notifications/Messages'
import Errors from '../../services/notifications/Errors'
import {
  MODAL,
  ENTIDADES,
  isKthBitSet,
}
  from '../../utils/Utils'
import {
  getColumnsCrudTelefone,
  getColumnsCrudEmail,
  foneInputFormatter,
}
  from '../../utils/UtilsBootstrapTable'

// Helper for initialStateCreate
import initialState from '../../services/initial-state'
import { cliente, message } from '../../utils/proptypes'
import ClienteAlert from '../../utils/cliente-alert'

const initialStateCreate = initialState.create()

class ClienteCrud extends Component {
  constructor (props) {
    super(props)

    // Modal cliente
    this.onCloseAddClienteModal = this.onCloseAddClienteModal.bind(this)

    // Modal Telefone
    this.openAddFoneModal = this.openAddFoneModal.bind(this)
    this.openEditFoneModal = this.openEditFoneModal.bind(this)
    this.onCloseFoneModal = this.onCloseFoneModal.bind(this)
    this.openDeleteFoneModal = this.openDeleteFoneModal.bind(this)
    this.onCloseDeleteFoneModal = this.onCloseDeleteFoneModal.bind(this)

    // Modal E-mail
    this.openAddEmailModal = this.openAddEmailModal.bind(this)
    this.openEditEmailModal = this.openEditEmailModal.bind(this)
    this.onCloseEmailModal = this.onCloseEmailModal.bind(this)
    this.openDeleteEmailModal = this.openDeleteEmailModal.bind(this)
    this.onCloseDeleteEmailModal = this.onCloseDeleteEmailModal.bind(this)

    // CRUD
    this.onEditCliente = this.onEditCliente.bind(this)
    this.onEditFone = this.onEditFone.bind(this)
    this.onDeleteFone = this.onDeleteFone.bind(this)
    this.onEditEmail = this.onEditEmail.bind(this)
    this.onDeleteEmail = this.onDeleteEmail.bind(this)

    // Handle Change
    this.handleChangeFor = this.handleChangeFor.bind(this)
    this.handleChangeForFone = this.handleChangeForFone.bind(this)
    this.handleChangeForEmail = this.handleChangeForEmail.bind(this)
    this.handleChangeCep = this.handleChangeCep.bind(this)

    this.columnsCrudTelefone = getColumnsCrudTelefone(
      this.openEditFoneModal,
      this.openDeleteFoneModal,
      props.actionSide,
    )
    this.columnsCrudEmail = getColumnsCrudEmail(this.openEditEmailModal,
      this.openDeleteEmailModal,
      props.actionSide)

    this.state = {
      cliente: props.cliente,
      telefone: initialStateCreate.Telefone(),
      modalFoneOpen: 0,
      email: initialStateCreate.Email(),
      modalEmailOpen: 0,
      maskFone: '',
    }
  }

  handleChangeCep (e) {
    e.preventDefault()
    const { cliente } = this.state

    const newCliente = {
      ...cliente,
      [e.target.name]: e.target.value,
    }

    this.setState({ cliente: newCliente })

    if (e.target.value.length < 10) return

    this.setState({ loading: true })
    const numeroCEP = e.target.value.replace(/\D/g, '')

    axios.get(`https://viacep.com.br/ws/${numeroCEP}/json/`)
      .then((res) => {
        const { cliente } = this.state
        const newCliente = {
          ...cliente,
          uf: res.data.uf,
          cidade: res.data.localidade,
          bairro: res.data.bairro,
          logradouro: res.data.logradouro,
          complemento: res.data.complemento,
        }
        this.setState({
          cliente: newCliente, loading: false, error: false,
        })
      }).catch(() => {
        this.setState({ error: true, loading: false })
      })
  }

  // CRUD
  onEditCliente = (e) => {
    e.preventDefault()
    const { cliente } = this.state

    if (cliente.telefones.length === 0) {
      ClienteAlert('Informar pelo menos um telefone!')
      return
    }

    if (cliente.emails.length === 0) {
      ClienteAlert('Informar pelo menos um e-mail!')
      return
    }

    this.setState({ loading: true })

    const newTelefones = cliente.telefones.map((fone) => ({
      id: fone.id.toString().startsWith('new') ? '' : parseInt(fone.id, 10),
      tipo: fone.tipo,
      numero: fone.numero.replace(/\D/g, ''),
    }))

    const newEmails = cliente.emails.map((email) => ({
      id: email.id.toString().startsWith('new') ? '' : parseInt(email.id, 10),
      endereco: email.endereco,
    }))

    const newCliente = {
      id: cliente.id.toString().startsWith('new') ? '' : parseInt(cliente.id, 10),
      nome: cliente.nome,
      cpf: cliente.cpf.replace(/\D/g, ''),
      cep: cliente.cep.replace(/\D/g, ''),
      logradouro: cliente.logradouro,
      complemento: cliente.complemento,
      bairro: cliente.bairro,
      cidade: cliente.cidade,
      uf: cliente.uf,
      telefones: newTelefones,
      emails: newEmails,
    }

    if (newCliente.id === '') {
      const { requestAdd } = this.props
      requestAdd(newCliente)
      this.setState({ cliente: initialStateCreate.Cliente() })
    } else {
      const { requestUpdate } = this.props
      requestUpdate(newCliente)
      this.onCloseAddClienteModal()
    }
  }

  onEditFone = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const { cliente, telefone, modalFoneOpen } = this.state
    const newFones = Object.assign([], cliente.telefones)

    if (isKthBitSet(modalFoneOpen, MODAL.ADD.FONE_OPEN)) {
      newFones.push(telefone)
      const newCliente = update(cliente, { telefones: { $set: newFones } })

      this.setState({ cliente: newCliente, telefone: initialStateCreate.Telefone(), maskFone: '' })
    } else if (isKthBitSet(modalFoneOpen, MODAL.EDIT.FONE_OPEN)) {
      const index = newFones.findIndex((fone) => fone.id === telefone.id)
      newFones[index] = { ...telefone, tipo: telefone.tipo, numero: telefone.numero }

      const newCliente = update(cliente, { telefones: { $set: newFones } })
      this.setState({ cliente: newCliente })

      this.onCloseFoneModal()
    }
  }

  onDeleteFone = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const { cliente, telefone } = this.state
    let newFones = Object.assign([], cliente.telefones)

    // delete telefone from telefones
    newFones = newFones.filter((fone) => fone.id !== telefone.id)
    this.setState({
      cliente: update(cliente, { telefones: { $set: newFones } }),
    })

    this.onCloseDeleteFoneModal()
  }

  // E-mail
  onEditEmail = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const { cliente, email, modalEmailOpen } = this.state
    const newEmails = Object.assign([], cliente.emails)

    if (isKthBitSet(modalEmailOpen, MODAL.ADD.EMAIL_OPEN)) {
      newEmails.push(email)
      const newCliente = update(cliente, { emails: { $set: newEmails } })
      this.setState({ cliente: newCliente, email: initialStateCreate.Email() })
    } else if (isKthBitSet(modalEmailOpen, MODAL.EDIT.EMAIL_OPEN)) {
      const index = newEmails.findIndex((_email) => _email.id === email.id)
      newEmails[index] = { ...email, endereco: email.endereco }

      const newCliente = update(cliente, { emails: { $set: newEmails } })
      this.setState({ cliente: newCliente })

      this.onCloseEmailModal()
    }
  }

  onDeleteEmail = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const { cliente, email } = this.state
    let newEmails = Object.assign([], cliente.emails)

    // delete email from emails
    newEmails = newEmails.filter((e) => e.id !== email.id)
    this.setState({
      cliente: update(cliente, { emails: { $set: newEmails } }),
    })

    this.onCloseDeleteEmailModal()
  }

  // Handle Change
  handleChangeFor = (e) => {
    e.preventDefault()

    const { cliente } = this.state

    const newCliente = {
      ...cliente,
      [e.target.name]: e.target.value,
    }

    this.setState({ cliente: newCliente })
  }

  handleChangeForFone = (e) => {
    e.preventDefault()
    const { telefone } = this.state

    if (e.target.name === 'tipo') {
      this.setState({ maskFone: e.target.value === 'CELULAR' ? '(99) 99999-9999' : '(99) 9999-9999' })
    } else if (e.target.name === 'numero' && e.target.value.length > 5) {
      if (telefone.tipo === 'CELULAR') {
        if (e.target.value.charAt(5) !== '9') {
          ClienteAlert('Informe: (XX) 9XXXX-XXXX')
          return
        }
      } else if (!'2345'.includes(e.target.value.charAt(5))) {
        ClienteAlert('Informe: (XX) 2XXX-XXXX ou 3XXX-XXXX ou 4XXX-XXXX ou 5XXX-XXXX')
        return
      }
    }

    const newFone = {
      ...telefone,
      [e.target.name]: e.target.value,
    }

    this.setState({ telefone: newFone })
  }

  handleChangeForEmail = (e) => {
    e.preventDefault()

    const { email } = this.state
    const emailValue = e.target.value

    const newEmail = {
      ...email,
      [e.target.name]: emailValue,
    }

    this.setState({ email: newEmail })
  }

  // Modals
  // E-mail
  openAddEmailModal = () => {
    const { showModal } = this.props
    showModal(MODAL.ADD.EMAIL_OPEN)

    this.setState({
      email: initialStateCreate.Email(),
      modalEmailOpen: MODAL.ADD.EMAIL_OPEN,
    })
  }

  onCloseEmailModal = () => {
    const { hideModal } = this.props
    const { modalEmailOpen } = this.state

    hideModal(modalEmailOpen)
    this.setState({ modalEmailOpen: 0 })
  }

  openEditEmailModal = (row) => {
    const { showModal } = this.props
    showModal(MODAL.EDIT.EMAIL_OPEN)

    this.setState({
      email: { id: row.id, endereco: row.endereco },
      modalEmailOpen: MODAL.EDIT.EMAIL_OPEN,
    })
  }

  openDeleteEmailModal = (row) => {
    const { showModal } = this.props
    showModal(MODAL.DELETE.EMAIL_OPEN)

    this.setState({
      email: { id: row.id, endereco: row.endereco },
    })
  }

  onCloseDeleteEmailModal = () => {
    const { hideModal } = this.props
    hideModal(MODAL.DELETE.EMAIL_OPEN)
  }

  // Telefone
  onCloseDeleteFoneModal = () => {
    const { hideModal } = this.props
    hideModal(MODAL.DELETE.FONE_OPEN)
  }

  openDeleteFoneModal = (row) => {
    const { showModal } = this.props
    showModal(MODAL.DELETE.FONE_OPEN)

    this.setState({
      telefone: { id: row.id, tipo: row.tipo, numero: row.numero },
    })
  }

  openEditFoneModal = (row) => {
    const { showModal } = this.props
    showModal(MODAL.EDIT.FONE_OPEN)

    this.setState({
      telefone: { id: row.id, tipo: row.tipo, numero: row.numero },
      modalFoneOpen: MODAL.EDIT.FONE_OPEN,
      maskFone: row.tipo === 'CELULAR' ? '(99) 99999-9999' : '(99) 9999-9999',
    })
  }

  onCloseFoneModal = () => {
    const { hideModal } = this.props
    const { modalFoneOpen } = this.state
    hideModal(modalFoneOpen)
    this.setState({ modalFoneOpen: 0 })
  }

  openAddFoneModal = () => {
    const { showModal } = this.props
    showModal(MODAL.ADD.FONE_OPEN)

    this.setState({
      telefone: initialStateCreate.Telefone(),
      modalFoneOpen: MODAL.ADD.FONE_OPEN,
      maskFone: '',
    })
  }

  // Cliente
  onCloseAddClienteModal = () => {
    const { closeModal } = this.props
    closeModal()
  }

  render () {
    const { cliente } = this.state
    const {
      nome, cpf, cep, logradouro, complemento, bairro, cidade, uf, telefones, emails,
    } = cliente
    const { telefone, email, maskFone } = this.state
    const {
      messages, errors, className, clienteCrudModals,
    } = this.props
    const entidades = ENTIDADES.getEntidades(clienteCrudModals, this.state)

    return (
      <>
        <Modal isOpen={entidades.Cliente.isOpen} className={className}>
          <ModalHeader><b>{entidades.Cliente.titulo}</b></ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onEditCliente}>
              <Row form>
                <Col md={8}>
                  <FormGroup>
                    <Label for="inputNewNome">Nome</Label>
                    <Input
                      type="text"
                      onChange={this.handleChangeFor}
                      name="nome"
                      id="inputNewNome"
                      value={nome}
                      minLength={3}
                      maxLength={100}
                      placeholder="Informe o nome"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="inputNewCPF">CPF</Label>
                    <Input
                      type="text"
                      mask="999.999.999-99"
                      maskChar={null}
                      onChange={this.handleChangeFor}
                      name="cpf"
                      id="inputNewCPF"
                      value={cpf}
                      tag={InputMask}
                      placeholder="Informe o CPF"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="inputNewCEP">CEP</Label>
                <Input
                  type="text"
                  mask="99.999-999"
                  maskChar={null}
                  onChange={this.handleChangeCep}
                  name="cep"
                  id="inputNewCEP"
                  value={cep}
                  tag={InputMask}
                  placeholder="Informe o CEP"
                  required
                />
              </FormGroup>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="inputNewLogradouro">Logradouro</Label>
                    <Input
                      type="text"
                      onChange={this.handleChangeFor}
                      name="logradouro"
                      id="inputNewLogradouro"
                      value={logradouro}
                      placeholder="Informe o logradouro"
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label for="inputNewComplemento">Complemento</Label>
                    <Input
                      type="text"
                      onChange={this.handleChangeFor}
                      name="complemento"
                      id="inputNewComplemento"
                      value={complemento}
                      placeholder="Informe o complemento"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row form>
                <Col md={2}>
                  <FormGroup>
                    <Label for="inputNewUF">UF</Label>
                    <Input
                      type="text"
                      onChange={this.handleChangeFor}
                      name="uf"
                      id="inputNewUF"
                      value={uf}
                      placeholder="Informe a UF"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="inputNewCidade">Cidade</Label>
                    <Input
                      type="text"
                      onChange={this.handleChangeFor}
                      name="cidade"
                      id="inputNewCidade"
                      value={cidade}
                      placeholder="Informe a cidade"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="inputNewBairro">Bairro</Label>
                    <Input
                      type="text"
                      onChange={this.handleChangeFor}
                      name="bairro"
                      id="inputNewBairro"
                      value={bairro}
                      placeholder="Informe a cidade"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={12}>
                  <Button onClick={this.openAddFoneModal} color="primary" value="novoTelefone" size="sm"><FontAwesomeIcon icon={faPlus} /></Button>
                  &nbsp;&nbsp;

                  <Label for="inputNewTelefone">Telefones</Label>
                  <BootstrapTable
                    keyField="id"
                    data={telefones}
                    columns={this.columnsCrudTelefone}
                    id="inputNewTelefone"
                  />
                  {telefones.length === 0 ? <font color="red">Deve ser informado pelo menos um telefone!</font> : ''}
                </Col>
              </Row>

              <Row form>
                <Col md={12}>
                  <Button onClick={this.openAddEmailModal} color="primary" value="novoEmail" size="sm"><FontAwesomeIcon icon={faPlus} /></Button>
                  &nbsp;&nbsp;

                  <Label for="inputNewEmail">E-mails</Label>
                  <BootstrapTable
                    keyField="id"
                    data={emails}
                    columns={this.columnsCrudEmail}
                    id="inputNewEmail"
                  />
                  {emails.length === 0 ? <font color="red">Deve ser informado pelo menos um e-mail!</font> : ''}
                </Col>
              </Row>
              <Button
                disabled={!entidades.Cliente.isBtnSalvarEnabled}
                color="primary"
                value="save"
                size="sm"
              >
                &nbsp;
                Salvar
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={this.onCloseAddClienteModal} color="secondary" value="cancel" size="sm"> Cancelar</Button>
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

        <Modal isOpen={entidades.Telefone.isOpen} className={className}>
          <ModalHeader>{entidades.Telefone.titulo}</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onEditFone} name="newFoneModal">
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="inputNewFoneTipo">Tipo</Label>
                    <Input
                      type="select"
                      onChange={this.handleChangeForFone}
                      name="tipo"
                      id="inputNewFoneTipo"
                      value={telefone.tipo}
                      placeholder="Informe o tipo"
                      required
                    >
                      <option value="">Informe o tipo</option>
                      <option value="RESIDENCIAL">RESIDENCIAL</option>
                      <option value="COMERCIAL">COMERCIAL</option>
                      <option value="CELULAR">CELULAR</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="inputNewFoneNumero">Número</Label>
                    <Input
                      type="text"
                      mask={maskFone}
                      maskChar={null}
                      onChange={this.handleChangeForFone}
                      name="numero"
                      id="inputNewFoneNumero"
                      value={telefone.numero}
                      tag={InputMask}
                      placeholder="Informe o número"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                disabled={!entidades.Telefone.isBtnSalvarEnabled}
                color="primary"
                value="save"
                size="sm"
              >
                &nbsp;
                Salvar
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={this.onCloseFoneModal} color="secondary" value="cancel" size="sm"> Cancelar</Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={entidades.Email.isOpen} className={className}>
          <ModalHeader>{entidades.Email.titulo}</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onEditEmail} name="newEmailModal">
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label for="inputNewEmailEndereco">Endereço E-mail</Label>
                    <Input
                      type="email"
                      onChange={this.handleChangeForEmail}
                      name="endereco"
                      id="inputNewEmailEndereco"
                      value={email.endereco}
                      placeholder="Informe o e-mail"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Button
                disabled={!entidades.Email.isBtnSalvarEnabled}
                color="primary"
                value="save"
                size="sm"
              >
                &nbsp;
                Salvar
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={this.onCloseEmailModal} color="secondary" value="cancel" size="sm"> Cancelar</Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={entidades.Telefone.deleteIsOpen} className={className}>
          <ModalHeader>{entidades.Telefone.titulo}</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onDeleteFone}>
              <FormGroup>
                <Label for="inputDeleteTipoNome">Tipo</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="tipo"
                    id="inputDeleteTipoNome"
                    value={telefone.tipo}
                    disabled
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <Label for="inputDeleteNumeroFone">Número</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="numero"
                    id="inputDeleteNumeroFone"
                    value={foneInputFormatter(telefone.numero)}
                    disabled
                  />
                </InputGroup>
              </FormGroup>
              <hr />
              <Button
                disabled={!entidades.Telefone.isBtnDeleteEnabled}
                color="danger"
                value="delete"
                size="sm"
              >
                &nbsp;
                Excluir
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={() => this.onCloseDeleteFoneModal()} color="secondary" value="cancel" size="sm"> Cancelar</Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={entidades.Email.deleteIsOpen} className={className}>
          <ModalHeader>{entidades.Email.titulo}</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onDeleteEmail}>
              <FormGroup>
                <Label for="inputDeleteEmailEndereco">E-mail</Label>
                <InputGroup>
                  <Input
                    type="text"
                    name="endereco"
                    id="inputDeleteEmailEndereco"
                    value={email.endereco}
                    disabled
                  />
                </InputGroup>
              </FormGroup>
              <hr />
              <Button
                disabled={!entidades.Email.isBtnDeleteEnabled}
                color="danger"
                value="delete"
                size="sm"
              >
                &nbsp;
                Excluir
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button onClick={() => this.onCloseDeleteEmailModal()} color="secondary" value="cancel" size="sm"> Cancelar</Button>
            </Form>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

ClienteCrud.propTypes = {
  cliente: PropTypes.shape(cliente).isRequired,
  clienteCrudModals: PropTypes.number.isRequired,
  actionSide: PropTypes.string,
  closeModal: PropTypes.func,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  requestAdd: PropTypes.func,
  requestUpdate: PropTypes.func,
  className: PropTypes.string,
  errors: PropTypes.arrayOf(PropTypes.shape(message)),
  messages: PropTypes.arrayOf(PropTypes.shape(message)),
}

const mapStateToProps = (state) => ({
  messages: state.clientes.messages,
  errors: state.clientes.errors,
  clienteCrudModals: state.modal.bitMask,
  actionSide: state.modal.actionSide,
})

const mapDispatchToProps = (dispatch) => bindActionCreators(
  { ...clientesActions, ...modalActions },
  dispatch,
)

export default connect(mapStateToProps, mapDispatchToProps)(ClienteCrud)
