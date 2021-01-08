import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import messageError from './errors'

/**
 * Action types & creators
 */
export const { Types, Creators } = createActions({
  requestAll: [],
  successAll: ['response'],
  failureAll: ['response'],
  requestAdd: ['cliente'],
  successAdd: ['response'],
  failureAdd: ['response'],
  requestUpdate: ['cliente'],
  successUpdate: ['response'],
  failureUpdate: ['response'],
  requestDelete: ['id'],
  successDelete: ['response'],
  failureDelete: ['response'],
})

/**
 * Reducer Handlers
 */
const INITIAL_STATE = Immutable({
  list: [],
  messages: [],
  errors: [],
  isLoaded: false,
  fetching: true,
})

const requestAll = (state = INITIAL_STATE) => (
  state.merge({
    messages: [{
      body: 'Loading...',
      time: new Date(),
    }],
    errors: [],
    isLoaded: false,
    fetching: true,
  })
)

const successAll = (state = INITIAL_STATE, action) => (
  state.merge({
    list: action.response,
    messages: [],
    errors: [],
    isLoaded: true,
    fetching: false,
  })
)

const failureAll = (state = INITIAL_STATE, action) => (
  state.merge({
    messages: [],
    errors: state.errors.concat([{
      body: messageError(action.response.request.status),
      time: new Date(),
    }]),
    isLoaded: false,
    fetching: false,
  })
)

const requestAdd = (state = INITIAL_STATE) => (
  state.merge({
    messages: [{
      body: 'Add...',
      time: new Date(),
    }],
    errors: [],
    fetching: true,
  })
)

const successAdd = (state = INITIAL_STATE, action) => (
  state.merge({
    list: state.list.concat(action.response),
    messages: [],
    errors: [],
    fetching: false,
  })
)
const failureAdd = (state = INITIAL_STATE, action) => (
  state.merge({
    messages: [],
    errors: state.errors.concat([{
      body: messageError(action.response.request.status),
      time: new Date(),
    }]),
    fetching: false,
  })
)

const requestUpdate = (state = INITIAL_STATE) => (
  state.merge({
    messages: [{
      body: 'Update...',
      time: new Date(),
    }],
    errors: [],
    fetching: true,
  })
)

const updateCliente = (state, data) => {
  const index = state.list.findIndex((item) => item.id === data.id)
  return Immutable.set(state.list, index, data)
}

const successUpdate = (state = INITIAL_STATE, action) => (
  state.merge({
    list: updateCliente(state, action.response),
    messages: [],
    errors: [],
    fetching: false,
  })
)

const failureUpdate = (state = INITIAL_STATE, action) => (
  state.merge({
    messages: [],
    errors: state.errors.concat([{
      body: messageError(action.response),
      time: new Date(),
    }]),
    fetching: false,
  })
)

const requestDelete = (state = INITIAL_STATE) => (
  state.merge({
    messages: [{
      body: 'Delete...',
      time: new Date(),
    }],
    errors: [],
    fetching: true,
  })
)

const successDelete = (state = INITIAL_STATE, action) => (
  state.merge({
    list: state.list.filter((item) => item.id !== action.response),
    messages: [],
    errors: [],
    fetching: false,
  })
)

const failureDelete = (state = INITIAL_STATE, action) => (
  state.merge({
    messages: [],
    errors: state.errors.concat([{
      body: messageError(action.response.request.status),
      time: new Date(),
    }]),
    fetching: false,
  })
)

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
  [Types.REQUEST_ALL]: requestAll,
  [Types.SUCCESS_ALL]: successAll,
  [Types.FAILURE_ALL]: failureAll,
  [Types.REQUEST_ADD]: requestAdd,
  [Types.SUCCESS_ADD]: successAdd,
  [Types.FAILURE_ADD]: failureAdd,
  [Types.REQUEST_UPDATE]: requestUpdate,
  [Types.SUCCESS_UPDATE]: successUpdate,
  [Types.FAILURE_UPDATE]: failureUpdate,
  [Types.REQUEST_DELETE]: requestDelete,
  [Types.SUCCESS_DELETE]: successDelete,
  [Types.FAILURE_DELETE]: failureDelete,
})
