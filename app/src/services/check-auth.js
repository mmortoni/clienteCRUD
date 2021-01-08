// import { setUser } from '../user/actions'
import History from './History'

function checkAuthorization (dispatch) {
  // attempt to grab the token from localstorage
  const storedUserToken = window.sessionStorage.getItem('user')

  // if it exists
  if (storedUserToken) {
    // parse it down into an object
    const user = JSON.parse(storedUserToken)

    // this just all works to compare the total seconds of the created
    // time of the token vs the ttl (time to live) seconds
    const createdDate = new Date(user.created)
    const created = Math.round(createdDate.getTime() / 1000)
    const ttl = 1209600
    const expiry = created + ttl

    // if the token has expired return false
    if (created > expiry) return false

    // otherwise, dispatch the token to our setUser action
    // which will update our redux state with the token and return true
    // dispatch(setUser(user))
    return true
  }

  return false
}

export function checkIndexAuthorization (store) {
  // by having a function that returns a function we satisfy 2 goals:
  //
  // 1. grab access to our Redux Store and thus Dispatch to call actions
  // 2. Return a function that includes all the proper .. properties that
  //    React Router expects for us to include and use
  //
  // `nextState` - the next "route" we're navigating to in the router
  // `replace` - a helper to change the route
  // `next` - what we call when we're done messing around
  //
  const { dispatch } = store

  if (checkAuthorization(dispatch)) {
    History.replace('/home')
  } else {
    History.replace('/login')
  }
}

export function checkHomeAuthorization (store) {
  // Same format - we do this to have the Redux State available.
  // The difference is that this time we also pull in the helper
  // `getState` which will allow us to.....
  // ....
  // get the state.
  //
  const { dispatch, getState } = store

  if (!checkAuthorization(dispatch)) {
    History.replace('/login')
  }

  // reference to the `user` piece of state
  const user = getState().user

  // is it defined and does it have a token? good, go ahead to home
  if (user && user.token) History.replace('/home')

  History.replace('/login')
}
