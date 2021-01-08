import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

import {
  setBit,
  clearBit,
} from '../../utils/Utils'

/**
 * Action types & creators
 */
export const { Types, Creators } = createActions({
  showModal: ['bitMask'],
  hideModal: ['bitMask'],
})

/**
 * Reducer Handlers
 */
const INITIAL_STATE = Immutable({
  bitMask: 0,
  actionSide: 'right',
})

// eslint-disable-next-line max-len
export const showModal = (state = INITIAL_STATE, action) => state.merge({ bitMask: setBit(state.bitMask, action.bitMask) })

export const hideModal = (state = INITIAL_STATE, action) => {
  if (state.bitMask === 0) {
    return state.merge({ bitMask: 0 })
  }

  return state.merge({ bitMask: clearBit(state.bitMask, action.bitMask) })
}

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
  [Types.SHOW_MODAL]: showModal,
  [Types.HIDE_MODAL]: hideModal,
})
