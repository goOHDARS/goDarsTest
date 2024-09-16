import { auth } from '@configs/firebase'
import { AppDispatch } from '../store'
import { API_URL } from '@env'

type RequestWithDispatchParams = {
  dispatch: AppDispatch
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  types: [requestType: string, successType: string, errorType: string]
  data?: Record<string, any>
  headers?: Record<string, string>
}

export const requestWithDispatch = async ({
  dispatch,
  endpoint,
  method = 'GET',
  types,
  data,
  headers = { 'Content-Type': 'application/json' },
}: RequestWithDispatchParams) => {
  const [request, success, failure] = types

  try {
    console.log(`starting request: ${endpoint}`)
    dispatch({ type: request })
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers,
      ...(method != 'GET' && data ? { body: JSON.stringify(data) } : {}),
    })

    if (response.ok) {
      console.log(`request success: ${endpoint}`)
      dispatch({ type: success, payload: await response.json() })
      return
    }

    if (response.status === 403) {
      dispatch({
        type: '@@user/GET_USER_FAILURE',
        payload: { message: 'Token expired', status: 403 },
      })
      dispatch({ type: '@@user/LOGOUT_USER' })
    }

    const errorData = await response.json()
    console.log(`request failure: ${errorData.error}`)
    dispatch({
      type: failure,
      payload: { message: errorData.error, status: response.status },
    })
  } catch (err: any) {
    console.log(`request failure: ${err}`)
    dispatch({
      type: failure,
      payload: { message: err.message, status: 500 },
    })
  }

  return
}

export const authRequestWithDispatch = async ({
  dispatch,
  endpoint,
  method = 'GET',
  types,
  data,
  headers = { 'Content-Type': 'application/json' },
}: RequestWithDispatchParams) => {
  await auth.authStateReady()
  const userToken = await auth.currentUser?.getIdToken()

  const combinedHeaders = { ...headers, Authorization: `Bearer ${userToken}` }
  return requestWithDispatch({
    dispatch,
    endpoint,
    method,
    types,
    data,
    headers: combinedHeaders,
  })
}
