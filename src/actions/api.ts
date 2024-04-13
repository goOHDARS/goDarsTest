import { auth } from '../configs/firebase'
import { AppDispatch } from '../store'
import {API_URL} from '@env'

type RequestWithDispatchParams = {
  dispatch: AppDispatch
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  types: [requestType: string, successType: string, errorType: string]
  data?: Record<string, any>
  headers?: Record<string, any>
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

  dispatch({ type: request })
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers,
    ...(method != 'GET' && data ? { body: JSON.stringify(data) } : {}),
  })

  if (response.ok) {
    dispatch({ type: success, payload: await response.json() })
    return
  }

  const errorData = await response.json()
  dispatch({
    type: failure,
    payload: { message: errorData.error, status: response.status },
  })
}

export const authRequestWithDispatch = async ({
  dispatch,
  endpoint,
  method = 'GET',
  types,
  data,
  headers = { 'Content-Type': 'application/json' },
}: RequestWithDispatchParams) => {
  const userToken = await auth.currentUser?.getIdToken()

  const combinedHeaders = { ...headers, Authorization: `Bearer ${userToken}` }
  requestWithDispatch({
    dispatch,
    endpoint,
    method,
    types,
    data,
    headers: combinedHeaders,
  })
}
