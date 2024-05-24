import { authRequestWithDispatch } from './api'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth } from '@configs/firebase'
import { AppDispatch } from '../store'

export const GET_USER_REQUEST = '@@user/GET_USER_REQUEST'
export const GET_USER_SUCCESS = '@@user/GET_USER_SUCCESS'
export const GET_USER_FAILURE = '@@user/GET_USER_FAILURE'

export const SET_USER_REQUEST = '@@user/SET_USER_REQUEST'
export const SET_USER_SUCCESS = '@@user/SET_USER_SUCCESS'
export const SET_USER_FAILURE = '@@user/SET_USER_FAILURE'

export const CLEAR_USER_ERRORS = '@@user/CLEAR_USER_ERRORS'

export const getCurrentUser = () => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'get_current_user',
      types: [GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE],
    })
  }
}

export const signInUser = (email: string, password: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: GET_USER_REQUEST })
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      dispatch({
        type: GET_USER_FAILURE,
        payload: {
          message: err.message,
          status: 500,
        },
      })
    }
    return
  }
}

export const signUpUser = (
  name: string,
  major: string,
  email: string,
  password: string,
  pid: string,
  year: number,
  semester: number
) => {
  return async (dispatch: AppDispatch) => {
    dispatch({ type: SET_USER_REQUEST })
    try {
      const userPromise = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await updateProfile(userPromise.user, { displayName: name })
    } catch (err: any) {
      dispatch({
        type: SET_USER_FAILURE,
        payload: {
          message: err.message,
          status: 500,
        },
      })
      return
    }

    return authRequestWithDispatch({
      dispatch,
      endpoint: 'create_user',
      method: 'POST',
      types: [SET_USER_REQUEST, SET_USER_SUCCESS, SET_USER_FAILURE],
      data: {
        name,
        major,
        email,
        pid,
        year,
        semester,
        onboarded: false,
      },
    })
  }
}

export const signOutUser = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: GET_USER_SUCCESS, payload: undefined })
    signOut(auth)
  }
}

export const resetUserErrors = () => {
  return (dispatch: AppDispatch) => {
    dispatch({ type: CLEAR_USER_ERRORS })
  }
}
