import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects'

// Our Cliente constants
import { Creators as clienteActions, Types } from '../ducks/clientes'

// Helper for api
import API from '../../services/api'

const api = API.create()

function getAll () {
  return api.getAllClientes()
    .then((response) => response.data)
    .catch((error) => { throw error })
}

export function* doAllClientes () {
  let response

  try {
    // make the call to the api
    response = yield call(getAll)

    // dispatch successful receiving children
    yield put(clienteActions.successAll(response))
  } catch (error) {
    yield put(clienteActions.failureAll(error))
  }

  return response
}

function addCliente (newCliente) {
  return api.addCliente(newCliente)
    .then((response) => response.data)
    .catch((error) => { throw error })
}

export function* doAddClientes (action) {
  const { cliente } = action
  let response

  try {
    // make the call to the api
    response = yield call(addCliente, cliente)

    // dispatch successful receiving children
    yield put(clienteActions.successAdd(response))
  } catch (error) {
    yield put(clienteActions.failureAdd(error))
  }

  return response
}

function updateCliente (newCliente) {
  return api.updateCliente(newCliente)
    .then((response) => response.data)
    .catch((error) => { throw error })
}

export function* doUpdateClientes (action) {
  const { cliente } = action
  let response

  try {
    // make the call to the api
    response = yield call(updateCliente, cliente)

    // dispatch successful receiving children
    yield put(clienteActions.successUpdate(response))
  } catch (error) {
    yield put(clienteActions.failureUpdate(error))
  }

  return response
}

function deleteCliente (id) {
  return api.deleteCliente(id)
    .then((response) => response.data)
    .catch((error) => { throw error })
}

export function* doDeleteClientes (action) {
  const { id } = action
  let response

  try {
    // make the call to the api
    response = yield call(deleteCliente, id)

    // dispatch successful receiving children
    yield put(clienteActions.successDelete(id))
  } catch (error) {
    yield put(clienteActions.failureDelete(error))
  }

  return response
}

export function* watchCrudClientes () {
  yield takeLatest(Types.REQUEST_ALL, doAllClientes)
  yield takeLatest(Types.REQUEST_ADD, doAddClientes)
  yield takeLatest(Types.REQUEST_UPDATE, doUpdateClientes)
  yield takeLatest(Types.REQUEST_DELETE, doDeleteClientes)
}
