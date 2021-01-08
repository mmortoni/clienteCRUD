import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import messageError from './errors'

/**
 * Action types & creators
 */
export const { Types, Creators } = createActions({
  requestLogin: ['credentials'],
  successLogin: ['response'],
  failureLogin: ['response'],
  logout: [],
})

/**
 * Reducer Handlers
 */
const INITIAL_STATE = Immutable({
  user: {},
  messages: [],
  errors: [],
})

const request = (state = INITIAL_STATE) => (
  state.merge({ user: {}, messages: [{ body: 'Logging in...', time: new Date() }], errors: [] })
)

const success = (state = INITIAL_STATE, action) => (
  state.merge({ user: action.response, messages: [], errors: [] })
)

const failure = (state = INITIAL_STATE, action) => (
  state.merge({
    user: {},
    messages: [],
    errors: state.errors.concat([{
      body: messageError(action.response.request.status),
      time: new Date(),
    }]),
  })
)

const logout = (state = INITIAL_STATE) => (
  state.merge({ user: {}, messages: [], errors: [] })
)

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
  [Types.REQUEST_LOGIN]: request,
  [Types.SUCCESS_LOGIN]: success,
  [Types.FAILURE_LOGIN]: failure,
  [Types.LOGOUT]: logout,
})
