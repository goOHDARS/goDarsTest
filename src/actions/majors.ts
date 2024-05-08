import { AppDispatch } from 'src/store'
import { authRequestWithDispatch, requestWithDispatch } from './api'

export const GET_MAJORS_REQUEST = '@@majors/GET_MAJORS_REQUEST'
export const GET_MAJORS_SUCCESS = '@@majors/GET_MAJORS_SUCCESS'
export const GET_MAJORS_FAILURE = '@@majors/GET_MAJORS_FAILURE'

export const GET_CURRENT_MAJOR_REQUEST = '@@majors/GET_CURRENT_MAJOR_REQUEST'
export const GET_CURRENT_MAJOR_SUCCESS = '@@majors/GET_CURRENT_MAJOR_SUCCESS'
export const GET_CURRENT_MAJOR_FAILURE = '@@majors/GET_CURRENT_MAJOR_FAILURE'

export const getMajorsList = () => {
  return (dispatch: AppDispatch) => {
    return requestWithDispatch({
      dispatch,
      endpoint: 'get_majors',
      types: [GET_MAJORS_REQUEST, GET_MAJORS_SUCCESS, GET_MAJORS_FAILURE],
    })
  }
}

export const getCurrentMajor = () => {
  return (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'get_current_major',
      types: [
        GET_CURRENT_MAJOR_REQUEST,
        GET_CURRENT_MAJOR_SUCCESS,
        GET_CURRENT_MAJOR_FAILURE,
      ],
    })
  }
}
