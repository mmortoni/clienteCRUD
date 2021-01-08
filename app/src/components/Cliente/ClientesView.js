import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory from 'react-bootstrap-table2-filter'

import { options, columnsClientes, defaultSorted } from '../../utils/UtilsBootstrapTable'
import { cliente } from '../../utils/proptypes'

class ClientesView extends Component {
  render () {
    const { clientes } = this.props
    return (
      <div>
        <BootstrapTable
          keyField="id"
          data={clientes}
          columns={columnsClientes}
          striped
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          loading
          pagination={paginationFactory(options)}
        />
      </div>
    )
  }
}

ClientesView.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape(cliente)).isRequired,
}

const mapStateToProps = (state) => ({
  clientes: state.clientes.list,
})

export default connect(mapStateToProps, null)(ClientesView)
