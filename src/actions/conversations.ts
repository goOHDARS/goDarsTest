import { AppDispatch } from 'src/store'
import { authRequestWithDispatch } from './api'
import { Message } from 'src/reducers/conversations'

export const CREATE_CHAT_REQ = '@@conversations/CREATE_CHAT_REQ'
export const CREATE_CHAT_SUCCESS = '@@conversations/CREATE_CHAT_SUCCESS'
export const CREATE_CHAT_FAIL = '@@conversations/CREATE_CHAT_FAIL'

export const GET_RESPONSE_REQUEST = '@@conversations/GET_RESPONSE_REQUEST'
export const GET_RESPONSE_SUCCESS = '@@conversations/GET_RESPONSE_SUCCESS'
export const GET_RESPONSE_FAILURE = '@@conversations/GET_RESPONSE_FAILURE'

export const createConversation = () => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'create_conversation',
      method: 'POST',
      types: [CREATE_CHAT_REQ, CREATE_CHAT_SUCCESS, CREATE_CHAT_FAIL],
    })
  }
}

export const getResponse = (conversationID: string, messages: Message[]) => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'get_ai_response',
      method: 'POST',
      types: [GET_RESPONSE_REQUEST, GET_RESPONSE_SUCCESS, GET_RESPONSE_FAILURE],
      data: {
        id: conversationID,
        messages,
      },
    })
  }
}

export const clearConversation = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: GET_RESPONSE_SUCCESS, payload: undefined })
  }
}
