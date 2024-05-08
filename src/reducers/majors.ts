import { UnknownAction } from '@reduxjs/toolkit'
import { BaseState, Error } from '.'
import * as majors from '@actions/majors'

type CurrentMajor = {
  degree: string
  name: string
  planned_length: number
  semester_divisions: number[]
}

type MajorsState = BaseState & {
  list?: string[]
  currentMajor?: CurrentMajor
}

const initialState: MajorsState = {
  loading: false,
  error: undefined,
  list: undefined,
  currentMajor: undefined
}

export default (state = initialState, action: UnknownAction): MajorsState => {
  switch (action.type) {
    case majors.GET_MAJORS_REQUEST:
    case majors.GET_CURRENT_MAJOR_REQUEST:
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
    case majors.GET_CURRENT_MAJOR_SUCCESS:
      return {
        ...state,
        loading: false,
        currentMajor: action.payload as CurrentMajor,
      }
    case majors.GET_MAJORS_FAILURE:
    case majors.GET_CURRENT_MAJOR_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as Error,
      }
    default:
      return state
  }
}
