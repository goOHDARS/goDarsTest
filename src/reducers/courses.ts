import { UnknownAction } from '@reduxjs/toolkit'
import { BaseState, Error } from '.'
import * as courses from '@actions/courses'

type CourseBrief = {
  id: string
  fullName: string
  shortName: string
  credits: number
  semester: number
  category: string
  subcategory?: string
}

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
      return {
        ...state,
        loading: true,
      }
    case courses.GET_COURSES_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: action.payload as CourseBrief[],
        error: undefined,
      }
    case courses.ADD_COURSE_SUCCESS:
      return {
        ...state,
        loading: false,
        courses: state.courses?.concat(action.payload as CourseBrief),
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
    case courses.GET_COURSES_FAILURE:
    case courses.SET_COURSES_FAILURE:
    case courses.ADD_COURSE_FAILURE:
    case courses.REMOVE_COURSE_FAILURE:
    case courses.GET_INFO_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as Error,
      }
    default:
      return state
  }
}
