import { UnknownAction } from '@reduxjs/toolkit'
import { BaseState, Error } from '.'
import * as courses from '@actions/courses'
import { LOGOUT_USER } from '@actions/user'

// shown in the list of courses in the dashboard
export type CourseBrief = {
  id: string
  fullName: string
  shortName: string
  credits: number
  semester: number | null
  category?: string
  subcategory?: string
}

// an overall course
type Course = {
  id: string
  college: string
  credits: number
  description: string
  fullName: string
  prereq: string[]
  semester: string
  shortName: string
}

// stored on the database
export type UserCourse = {
  id: string
  course: string
  semester: number
  category: string
  subcategory?: string
}

type CoursesState = BaseState & {
  selectedCourse?: Course
  courses?: CourseBrief[]
  queryResults?: CourseBrief[]
  totalCredits?: number
}

const initialState: CoursesState = {
  loading: false,
}

export default (state = initialState, action: UnknownAction): CoursesState => {
  switch (action.type) {
    case courses.GET_COURSES_REQUEST:
    case courses.SET_COURSES_REQUEST:
    case courses.ADD_COURSE_REQUEST:
    case courses.REMOVE_COURSE_REQUEST:
    case courses.GET_INFO_REQUEST:
    case courses.QUERY_COURSES_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case courses.GET_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: action.payload as CourseBrief[],
        totalCredits: (action.payload as CourseBrief[]).reduce((acc, course) => {
          return acc + course.credits
        }, 0),
        error: undefined,
      }
    case courses.ADD_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: state.courses?.concat(action.payload as CourseBrief),
        totalCredits: state.totalCredits ? state.totalCredits + (action.payload as CourseBrief).credits : state.totalCredits,
        error: undefined,
      }
    case courses.REMOVE_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: state.courses?.filter(
          (course) =>
            course.shortName !==
            (action.payload as { courseName: string }).courseName
        ),
        totalCredits: state.totalCredits ? state.totalCredits - (action.payload as CourseBrief).credits : state.totalCredits,
        error: undefined,
      }
    case courses.GET_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedCourse: action.payload as Course,
        error: undefined,
      }
    case courses.SET_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
      }
    case courses.QUERY_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: undefined,
        queryResults: action.payload as CourseBrief[],
      }
    case courses.GET_COURSES_FAILURE:
    case courses.SET_COURSES_FAILURE:
    case courses.ADD_COURSE_FAILURE:
    case courses.REMOVE_COURSE_FAILURE:
    case courses.GET_INFO_FAILURE:
    case courses.QUERY_COURSES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as Error,
      }
    case LOGOUT_USER:
      return initialState
    default:
      return state
  }
}
