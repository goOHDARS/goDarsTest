import { UnknownAction } from '@reduxjs/toolkit'
import { BaseState, Error } from '.'
import * as conversations from '../actions/conversations'

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  tool_call_id?: string
}

export type Conversation = {
  id: string
  userID: string
  messages: Message[]
}

type ConversationsState = BaseState & {
  currentConversation?: Conversation
}

const initialState: ConversationsState = {
  loading: false,
}

export default (
  state = initialState,
  action: UnknownAction
): ConversationsState => {
  switch (action.type) {
    case conversations.GET_RESPONSE_REQUEST:
    case conversations.CREATE_CHAT_REQ:
      return {
        ...state,
        loading: true,
      }
    case conversations.CREATE_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        currentConversation: action.payload as Conversation,
      }
    case conversations.GET_RESPONSE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        currentConversation: state.currentConversation
          ? {
            ...state.currentConversation,
            messages: state.currentConversation.messages.concat(
                action.payload as Message[]
            ),
          }
          : undefined,
      }
    case conversations.GET_RESPONSE_FAILURE:
    case conversations.CREATE_CHAT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload as Error,
      }
    default:
      return state
  }
}
