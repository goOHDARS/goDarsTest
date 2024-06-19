import { UnknownAction } from '@reduxjs/toolkit'
import * as user from '@actions/user'
import { BaseState, Error } from '.'
import { removeKey, setKey } from '@utils/storage'

type User = {
  id: string
  name: string
  major: string
  email: string
  pid: string
  year: number
  semester: number
  onboarded: boolean
  photoURL: string
  borderURLColor: string
  credits: number
}

type UserState = BaseState & {
  user?: User
  loggedIn: boolean
}

const initialState: UserState = {
  loading: false,
  loggedIn: false,
}

export default (state = initialState, action: UnknownAction): UserState => {
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
        user: action.payload as User,
      }
    case user.GET_USER_FAILURE:
    case user.SET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as Error,
      }
    case user.CLEAR_USER_ERRORS:
      return {
        ...state,
        error: undefined,
      }
    case user.SET_LOGGED_IN:
      setKey('logged_in')
      return {
        ...state,
        loggedIn: true,
      }
    case user.LOGOUT_USER:
      removeKey('logged_in')
      return initialState
    default:
      return state
  }
}
