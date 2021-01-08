import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

import { message } from '../../utils/proptypes'

// Iterate over each error object and print them
// in an unordered list
const Errors = (props) => {
  const { message, errors } = props
  return (
    <div>
      <Alert color="danger">
        {message}
      </Alert>
      <ul>
        {errors.map((errors) => (
          <li key={errors.time}>{errors.body}</li>
        ))}
      </ul>
    </div>
  )
}

Errors.propTypes = {
  message: PropTypes.shape(message),
  errors: PropTypes.arrayOf(PropTypes.shape(message)),
}

export default Errors
