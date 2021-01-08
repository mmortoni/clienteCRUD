import { createBrowserHistory } from 'history'

// our "constructor"
// eslint-disable-next-line no-unused-vars
const history = (location = null, forceRefresh = false) => {
  // ------
  // STEP 1
  // ------
  //
  // Configure an history object.
  //
  const history = createBrowserHistory({ forceRefresh })

  // ------
  // STEP 2
  // ------
  //
  // Create interfaces an history object.
  //
  //
  // history
  const History = () => history

  // forwardTo location
  const forwardTo = (location) => history.replace(location)

  //
  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in STEP 2.
  //
  // Notice we're not returning back the `history` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from STEP 2
    History,
    forwardTo,
  }
}

// let's return back our history method as the default.
export default {
  history,
}
