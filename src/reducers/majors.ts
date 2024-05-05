import { UnknownAction } from '@reduxjs/toolkit'
import { BaseState, Error } from '.'
import * as majors from '@actions/majors'

type MajorsState = BaseState & {
  list?: string[]
}

const initialState: MajorsState = {
  loading: false,
  error: undefined,
  list: undefined,
}

export default (state = initialState, action: UnknownAction): MajorsState => {
  switch (action.type) {
    case majors.GET_MAJORS_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case majors.GET_MAJORS_SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload as string[],
      }
    case majors.GET_MAJORS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as Error,
      }
    default:
      return state
  }
}
