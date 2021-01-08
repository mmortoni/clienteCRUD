import React from 'react'
import Immutable from 'seamless-immutable'

import { textFilter } from 'react-bootstrap-table2-filter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEdit,
  faTrash,
  faSort,
  faSortUp,
  faSortDown,
}
  from '@fortawesome/free-solid-svg-icons'

import {
  Button,
} from 'reactstrap'

import {
  MODAL,
} from './Utils'

export const foneFormatter = (cell, row) => {
  if (row.telefones) {
    const listItems = row.telefones.map((fone) => {
      let numero = fone.numero.replace(/\D/g, '')
      numero = numero.replace(/^(\d{2})(\d)/g, '($1) $2')
      numero = numero.replace(/(\d)(\d{4})$/, '$1-$2')

      return <li key={fone.numero}>{`${fone.tipo}: ${numero}`}</li>
    })

    return (<ul>{listItems}</ul>)
  }

  return (
    <span>{}</span>
  )
}
export const foneInputFormatter = (fone) => {
  if (fone) {
    let foneMask = fone.replace(/\D/g, '')
    foneMask = foneMask.replace(/^(\d{2})(\d)/g, '($1) $2')
    foneMask = foneMask.replace(/(\d)(\d{4})$/, '$1-$2')

    return foneMask
  }

  return ''
}

export const emailFormatter = (cell, row) => {
  if (row.emails) {
    const listItems = row.emails.map((email) => <li key={email.id}>{email.endereco}</li>)

    return (<ul>{listItems}</ul>)
  }

  return (<span>{}</span>)
}

export const cpfInputFormatter = (cpf) => {
  if (cpf) {
    let cpfMask = cpf.replace(/\D/g, '')
    cpfMask = cpfMask.replace(/(\d{3})(\d)/, '$1.$2')
    cpfMask = cpfMask.replace(/(\d{3})(\d)/, '$1.$2')
    cpfMask = cpfMask.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    return cpfMask
  }

  return ''
}

export const cpfFormatter = (cell, row) => {
  if (row.cpf) {
    return cpfInputFormatter(row.cpf)
  }

  return (<span>{}</span>)
}

export const cepFormatter = (cell, row) => {
  if (row.cep) {
    let cep = row.cep.replace(/\D/g, '')
    cep = cep.replace(/^(\d{2})(\d)/, '$1.$2')
    cep = cep.replace(/\.(\d{3})(\d)/, '.$1-$2')

    return cep
  }

  return (<span>{}</span>)
}

export const sortCaret = (order) => {
  if (!order) {
    return (
      <span>
        &nbsp;&nbsp;
        <FontAwesomeIcon icon={faSort} />
      </span>
    )
  }

  if (order === 'asc') {
    return (
      <span>
        &nbsp;&nbsp;
        <FontAwesomeIcon icon={faSortUp} />
      </span>
    )
  }

  if (order === 'desc') {
    return (
      <span>
        &nbsp;&nbsp;
        <FontAwesomeIcon icon={faSortDown} />
      </span>
    )
  }

  return null
}

export const options = {
  pageStartIndex: 0,
  // alwaysShowAllBtns: true, // Always show next and previous button
  // withFirstAndLast: false, // Hide the going to First and Last page button
  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
  // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
  firstPageText: 'First',
  prePageText: 'Back',
  nextPageText: 'Next',
  lastPageText: 'Last',
  nextPageTitle: 'First page',
  prePageTitle: 'Pre page',
  firstPageTitle: 'Next page',
  lastPageTitle: 'Last page',
  showTotal: true,
  sizePerPageList: [{
    text: '5', value: 5,
  }, {
    text: '10', value: 10,
  }, {
    text: '15', value: 15,
  }, {
    text: '20', value: 20,
  }, {
    text: '25', value: 25,
  }],
}

export const columnsClientes = Immutable([{
  dataField: 'id',
  text: 'ID',
  headerAlign: 'center',
  hidden: true,
}, {
  dataField: 'nome',
  text: 'Nome',
  headerAlign: 'center',
  filter: textFilter(),
  sort: true,
  sortCaret,
}, {
  dataField: 'cpf',
  text: 'CPF',
  headerAlign: 'center',
  filter: textFilter(),
  formatter: cpfFormatter,
  sort: true,
  sortCaret,
}, {
  dataField: 'cep',
  text: 'CEP',
  headerAlign: 'center',
  filter: textFilter(),
  formatter: cepFormatter,
  sort: true,
  sortCaret,
}, {
  dataField: 'logradouro',
  text: 'Logradouro',
  headerAlign: 'center',
}, {
  dataField: 'complemento',
  text: 'Complemento',
  headerAlign: 'center',
}, {
  dataField: 'bairro',
  text: 'Bairro',
  headerAlign: 'center',
  filter: textFilter(),
  sort: true,
  sortCaret,
}, {
  dataField: 'cidade',
  text: 'cidade',
  headerAlign: 'center',
  filter: textFilter(),
  sort: true,
  sortCaret,
}, {
  dataField: 'uf',
  text: 'UF',
  headerAlign: 'center',
  filter: textFilter(),
  sort: true,
  sortCaret,
}, {
  dataField: 'telefones',
  text: 'Telefone',
  formatter: foneFormatter,
  headerAlign: 'center',
}, {
  dataField: 'emails',
  text: 'E-mail',
  formatter: emailFormatter,
  headerAlign: 'center',
}])

export const getColumnsCrudCliente = (openEditModal, openDeleteModal, actionSide) => {
  const colClientes = Immutable.asMutable(columnsClientes)
  let columns = [
    {
      dataField: 'action',
      isDummyField: true,
      text: 'Ação',
      headerStyle: {
        backgroundColor: '#dddddd',
        fontSize: '18px',
      },
      headerAlign: 'center',
      align: 'center',
      formatter: (cellContent, row) => (
        <div>
          <Button
            onClick={() => openEditModal(row, MODAL.EDIT.CLIENTE_OPEN)}
            color="primary"
            size="sm"
          >
            <FontAwesomeIcon
              icon={faEdit}
            />
          </Button>
            &nbsp;&nbsp;&nbsp;
          <Button onClick={() => openDeleteModal(row)} color="warning" size="sm"><FontAwesomeIcon icon={faTrash} /></Button>
        </div>
      ),
    },
  ]

  if (actionSide.toLowerCase() === 'left') {
    columns = columns.concat(colClientes)
  } else if (actionSide.toLowerCase() === 'right') {
    columns = colClientes.concat(columns)
  }

  return columns
}

export const defaultSorted = [{
  dataField: 'nome',
  order: 'asc',
}]

export const columnsTelefones = Immutable([{
  dataField: 'id',
  text: 'ID',
  headerAlign: 'center',
  hidden: true,
}, {
  dataField: 'tipo',
  text: 'Tipo',
}, {
  dataField: 'numero',
  text: 'Número',
  formatter: (cell, row) => {
    let numero = cell.replace(/\D/g, '')

    if (row.tipo === 'CELULAR') {
      if (numero.charAt(2) !== '9') return (<span />)
    } else if (!'2345'.includes(numero.charAt(2))) return (<span />)

    numero = numero.replace(/^(\d{2})(\d)/g, '($1) $2')
    numero = numero.replace(/(\d)(\d{4})$/, '$1-$2')

    return (<span>{numero}</span>)
  },
}])

export const getColumnsCrudTelefone = (openEditFoneModal, openDeleteFoneModal, actionSide) => {
  const colTelefones = Immutable.asMutable(columnsTelefones)
  let columns = [
    {
      dataField: 'action',
      isDummyField: true,
      text: 'Ação',
      headerStyle: {
        backgroundColor: '#dddddd',
        fontSize: '18px',
      },
      headerAlign: 'center',
      align: 'center',
      formatter: (cellContent, row) => (
        <div>
          <Button onClick={() => openEditFoneModal(row)} color="primary" size="sm"><FontAwesomeIcon icon={faEdit} /></Button>
            &nbsp;&nbsp;&nbsp;
          <Button onClick={() => openDeleteFoneModal(row)} color="warning" size="sm"><FontAwesomeIcon icon={faTrash} /></Button>
        </div>
      ),
    },
  ]

  if (actionSide.toLowerCase() === 'left') {
    columns = columns.concat(colTelefones)
  } else if (actionSide.toLowerCase() === 'right') {
    columns = colTelefones.concat(columns)
  }

  return columns
}

export const columnsEmails = Immutable([{
  dataField: 'id',
  text: 'ID',
  headerAlign: 'center',
  hidden: true,
}, {
  dataField: 'endereco',
  text: 'Endereço',
}])

export const getColumnsCrudEmail = (openEditEmailModal, openDeleteEmailModal, actionSide) => {
  const colEmails = Immutable.asMutable(columnsEmails)
  let columns = [
    {
      dataField: 'action',
      isDummyField: true,
      text: 'Ação',
      headerStyle: {
        backgroundColor: '#dddddd',
        fontSize: '18px',
      },
      headerAlign: 'center',
      align: 'center',
      formatter: (cellContent, row) => (
        <div>
          <Button onClick={() => openEditEmailModal(row)} color="primary" size="sm"><FontAwesomeIcon icon={faEdit} /></Button>
            &nbsp;&nbsp;&nbsp;
          <Button onClick={() => openDeleteEmailModal(row)} color="warning" size="sm"><FontAwesomeIcon icon={faTrash} /></Button>
        </div>
      ),
    },
  ]

  if (actionSide.toLowerCase() === 'left') {
    columns = columns.concat(colEmails)
  } else if (actionSide.toLowerCase() === 'right') {
    columns = colEmails.concat(columns)
  }

  return columns
}
