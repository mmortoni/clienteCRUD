import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory from 'react-bootstrap-table2-filter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
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
} from 'reactstrap'

import ClienteCrud from './cliente-crud'
import {
  MODAL,
  ENTIDADES,
} from '../../utils/Utils'

import { Creators as clientesActions } from '../../store/ducks/clientes'
import { Creators as modalActions } from '../../store/ducks/modal'
import { cliente } from '../../utils/proptypes'

import {
  options,
  cpfInputFormatter,
  getColumnsCrudCliente,
  defaultSorted,
} from '../../utils/UtilsBootstrapTable'

// Helper for initialStateCreate
import initialState from '../../services/initial-state'

const initialStateCreate = initialState.create()

class ClientesGrid extends Component {
  constructor (props) {
    super(props)

    // Modal cliente
    this.openEditModal = this.openEditModal.bind(this)
    this.openDeleteModal = this.openDeleteModal.bind(this)

    this.onCloseEditModal = this.onCloseEditModal.bind(this)
    this.onCloseDeleteModal = this.onCloseDeleteModal.bind(this)

    this.onDeleteCliente = this.onDeleteCliente.bind(this)

    this.columnsCrudCliente = getColumnsCrudCliente(
      this.openEditModal,
      this.openDeleteModal,
      props.actionSide,
    )

    this.state = {
      cliente: {},
    }
  }

  openEditModal = (cliente, bitMask) => {
    const { showModal } = this.props
    showModal(bitMask)
    this.setState({ cliente })
  }

  onCloseEditModal = () => {
    const { hideModal, clienteCrudModals } = this.props
    hideModal(clienteCrudModals)
  }

  openDeleteModal = (cliente) => {
    const { showModal } = this.props

    showModal(MODAL.DELETE.CLIENTE_OPEN)
    this.setState({ cliente })
  }

  onCloseDeleteModal = () => {
    const { hideModal } = this.props

    hideModal(MODAL.DELETE.CLIENTE_OPEN)
  }

  onDeleteCliente = (e) => {
    e.preventDefault()

    const { requestDelete } = this.props
    const { cliente } = this.state

    requestDelete(cliente.id)
    this.onCloseDeleteModal()
  }

  render () {
    const { cliente } = this.state
    const { clientes, className, clienteCrudModals } = this.props
    const entidades = ENTIDADES.getEntidades(clienteCrudModals, this.state)

    return (
      <div>
        <div>
          <Button
            onClick={() => this.openEditModal(initialStateCreate.Cliente(), MODAL.ADD.CLIENTE_OPEN)}
            color="primary"
            size="sm"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>

          <BootstrapTable
            keyField="id"
            data={clientes}
            columns={this.columnsCrudCliente}
            striped
            defaultSorted={defaultSorted}
            filter={filterFactory()}
            loading
            pagination={paginationFactory(options)}
          />
        </div>

        <div>
          <Modal isOpen={entidades.Cliente.deleteIsOpen} className={className}>
            <ModalHeader>{entidades.Cliente.titulo}</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onDeleteCliente}>
                <FormGroup>
                  <Label for="inputDeleteNome">Nome</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="nome"
                      id="inputDeleteNome"
                      value={cliente.nome}
                      disabled
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label for="inputDeleteCPF">CPF</Label>
                  <InputGroup>
                    <Input
                      type="text"
                      name="cpf"
                      id="inputDeleteCPF"
                      value={cpfInputFormatter(cliente.cpf)}
                      disabled
                    />
                  </InputGroup>
                </FormGroup>
                <hr />
                <Button
                  disabled={!entidades.Cliente.isBtnDeleteEnabled}
                  color="danger"
                  value="delete"
                  size="sm"
                >
                  &nbsp;
                  Excluir
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                  onClick={() => this.onCloseDeleteModal()}
                  color="secondary"
                  value="cancel"
                  size="sm"
                >
                  &nbsp;
                  Cancelar
                </Button>
              </Form>
            </ModalBody>
          </Modal>
        </div>

        {
          entidades.Cliente.isOpen
          && (
            <ClienteCrud
              closeModal={this.onCloseEditModal}
              openModal={entidades.Cliente.isOpen}
              cliente={cliente}
            />
          )
        }
      </div>
    )
  }
}

ClientesGrid.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape(cliente)).isRequired,
  clienteCrudModals: PropTypes.number.isRequired,
  actionSide: PropTypes.string,
  className: PropTypes.string,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  requestDelete: PropTypes.func,
}

const mapStateToProps = (state) => ({
  clientes: state.clientes.list,
  clienteCrudModals: state.modal.bitMask,
  actionSide: state.modal.actionSide,
})

// eslint-disable-next-line max-len
const mapDispatchToProps = (dispatch) => bindActionCreators({ ...clientesActions, ...modalActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ClientesGrid)
