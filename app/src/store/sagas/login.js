import {
  call,
  put,
  takeLatest,
  cancelled,
} from 'redux-saga/effects'

// So that we can modify our User piece of state
import { Creators as loginActions, Types } from '../ducks/login'

// Helper for api
import API from '../../services/api'

const api = API.create()

function loginApi (userName, password) {
  const data = `{"userName": "${userName}", "password": "${password}"}`

  return api.requestLogin(JSON.parse(data))
    .then((response) => response.data)
    .catch((error) => { throw error })
}

export function* doLogin (action) {
  let response
  try {
    const { userName, password } = action.credentials

    // try to call to our loginApi() function.  Redux Saga
    // will pause here until we either are successful or
    // receive an error
    response = yield call(loginApi, userName, password)

    // set a stringified version of our user to sessionStorage on our domain
    // eslint-disable-next-line no-undef
    window.sessionStorage.setItem('user', JSON.stringify(response))

    // inform Redux to set our user, this is non blocking so...
    // also inform redux that our login was successful
    yield put(loginActions.successLogin(response))
  } catch (error) {
    // error? send it to redux
    yield put(loginActions.failureLogin(error))
  } finally {
    if (yield (cancelled())) {
      // eslint-disable-next-line no-console
      console.log('cancelled()')
    }
  }
  // return the response for health and wealth
  return response
}

export function* watchLogin () {
  yield takeLatest(Types.REQUEST_LOGIN, doLogin)
}
