import { AppDispatch } from 'src/store'
import { requestWithDispatch } from './api'

export const GET_MAJORS_REQUEST = '@@majors/GET_MAJORS_REQUEST'
export const GET_MAJORS_SUCCESS = '@@majors/GET_MAJORS_SUCCESS'
export const GET_MAJORS_FAILURE = '@@majors/GET_MAJORS_FAILURE'

export const getMajorsList = () => {
  return (dispatch: AppDispatch) => {
    return requestWithDispatch({
      dispatch,
      endpoint: 'get_majors',
      types: [GET_MAJORS_REQUEST, GET_MAJORS_SUCCESS, GET_MAJORS_FAILURE],
    })
  }
}
