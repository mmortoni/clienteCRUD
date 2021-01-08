/* eslint-disable no-undef */
import axios from 'axios'

// constructor
const create = (baseURL = 'http://127.0.0.1:8080/api/v1') => {
  // ------
  // STEP 1
  // ------
  //
  // Configure an axios api object.
  //
  const api = axios.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
    // 10 second timeout...
    timeout: 10240,
  })

  // Interceptors Token
  api.interceptors.request.use((request) => {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    const originalRequest = request

    if (user !== null) {
      originalRequest.headers.Authorization = user.token
      return originalRequest
    }

    return request
  }, (err) => Promise.reject(err))

  // ------
  // STEP 2
  // ------
  //
  // Create interfaces an apisauce-based api object.
  //
  //
  // Login user
  const requestLogin = (userCredentials) => api.post('/login', userCredentials)

  // Get only one cliente
  const getCliente = (clienteId) => api.get(`/clientes/${clienteId}`)

  //                      CRUD
  // Get all clientes
  // http://127.0.0.1:8080/api/v1/clientes
  const getAllClientes = () => api.get('/clientes')

  // Add cliente
  // http://127.0.0.1:8080/api/v1/clientes
  const addCliente = (newCliente) => api.post('/clientes', newCliente)

  // Update cliente
  // http://127.0.0.1:8080/api/v1/clientes
  const updateCliente = (newCliente) => api.put('/clientes', newCliente)

  // Delete cliente
  // http://127.0.0.1:8080/api/v1/clientes
  const deleteCliente = (clienteId) => api.delete(`/clientes/${clienteId}`)

  //
  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in STEP 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from STEP 2
    requestLogin,
    getCliente,
    getAllClientes,
    addCliente,
    updateCliente,
    deleteCliente,
  }
}

// let's return back our create method as the default.
export default {
  create,
}
