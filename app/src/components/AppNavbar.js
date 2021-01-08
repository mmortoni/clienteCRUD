import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  Button,
} from 'reactstrap'
import { Link } from 'react-router-dom'

export default class AppNavbar extends Component {
  render () {
    const { logout } = this.props
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/home">Principal</NavbarBrand>

        <p className="text-center mt-4 mb-4" />

        <Nav className="justify-content-end">
          <NavItem>
            <Button color="primary" onClick={() => { logout() }}>Logout</Button>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}

AppNavbar.propTypes = {
  logout: PropTypes.func.isRequired,
}
