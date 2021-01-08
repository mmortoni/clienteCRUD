export default function messageError (status) {
  let message = ''

  switch (status) {
    case 0:
      message = 'Network Error'
      break
    case 401:
      message = 'Invalid credentials'
      break
    case 500:
      message = 'Internal Server Error'
      break
    default:
      // eslint-disable-next-line no-prototype-builtins
      if (typeof status === 'object' && status.hasOwnProperty('message')) {
        message = status.message
      } else {
        message = 'Something went wrong'
      }
  }

  return message
}
