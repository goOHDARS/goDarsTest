import { UnknownAction } from '@reduxjs/toolkit'
import * as user from '../actions/user'

type UserState = {
  loading: boolean
  error?: {
    message: string
    status: number
  }
  user?: {
    name: string
    major: string
    email: string
    pid: string
    year: string
    onboarded: boolean
  }
}

const initialState: UserState = {
  loading: false,
  error: undefined,
  user: undefined,
}

export default (state = initialState, action: UnknownAction) => {
  switch (action.type) {
    case user.GET_USER_REQUEST:
    case user.SET_USER_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case user.GET_USER_SUCCESS:
    case user.SET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        user: action.payload
      }
    case user.GET_USER_FAILURE:
    case user.SET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    default:
      return state
  }
}
