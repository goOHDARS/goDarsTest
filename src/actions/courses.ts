import { AppDispatch } from 'src/store'
import { authRequestWithDispatch } from './api'
import { UserCourse } from 'src/reducers/courses'

export const GET_COURSES_REQUEST = '@@courses/GET_COURSES_REQUEST'
export const GET_COURSES_SUCCESS = '@@courses/GET_COURSES_SUCCESS'
export const GET_COURSES_FAILURE = '@@courses/GET_COURSES_FAILURE'

export const SET_COURSES_REQUEST = '@@courses/SET_COURSES_REQUEST'
export const SET_COURSES_SUCCESS = '@@courses/SET_COURSES_SUCCESS'
export const SET_COURSES_FAILURE = '@@courses/SET_COURSES_FAILURE'

export const ADD_COURSE_REQUEST = '@@courses/ADD_COURSE_REQUEST'
export const ADD_COURSE_SUCCESS = '@@courses/ADD_COURSE_SUCCESS'
export const ADD_COURSE_FAILURE = '@@courses/ADD_COURSE_FAILURE'

export const REMOVE_COURSE_REQUEST = '@@courses/REMOVE_COURSE_REQUEST'
export const REMOVE_COURSE_SUCCESS = '@@courses/REMOVE_COURSE_SUCCESS'
export const REMOVE_COURSE_FAILURE = '@@courses/REMOVE_COURSE_FAILURE'

export const GET_INFO_REQUEST = '@@courses/GET_INFO_REQUEST'
export const GET_INFO_SUCCESS = '@@courses/GET_INFO_SUCCESS'
export const GET_INFO_FAILURE = '@@courses/GET_INFO_FAILURE'

export const QUERY_COURSES_REQUEST = '@@courses/QUERY_COURSES_REQUEST'
export const QUERY_COURSES_SUCCESS = '@@courses/QUERY_COURSES_SUCCESS'
export const QUERY_COURSES_FAILURE = '@@courses/QUERY_COURSES_FAILURE'

export const queryCourses = (search: string) => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'query_courses',
      method: 'POST',
      types: [
        QUERY_COURSES_REQUEST,
        QUERY_COURSES_SUCCESS,
        QUERY_COURSES_FAILURE,
      ],
      data: {
        search,
      },
    })
  }
}

export const getInitialCourses = () => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'get_initial_courses',
      types: [GET_COURSES_REQUEST, GET_COURSES_SUCCESS, GET_COURSES_FAILURE],
    })
  }
}

export const setInitialCourses = (courses: Omit<UserCourse, 'id'>[]) => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'set_initial_courses',
      method: 'POST',
      types: [SET_COURSES_REQUEST, SET_COURSES_SUCCESS, SET_COURSES_FAILURE],
      data: {
        courses,
      },
    })
  }
}

export const getCourses = () => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'get_courses',
      types: [GET_COURSES_REQUEST, GET_COURSES_SUCCESS, GET_COURSES_FAILURE],
    })
  }
}

export const addUserCourse = (courseInfo: Omit<UserCourse, 'id'>) => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'add_user_course',
      method: 'POST',
      types: [ADD_COURSE_REQUEST, ADD_COURSE_SUCCESS, ADD_COURSE_FAILURE],
      data: {
        course: courseInfo,
      },
    })
  }
}

export const removeUserCourse = (courseName: string) => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'remove_user_course',
      method: 'DELETE',
      types: [
        REMOVE_COURSE_REQUEST,
        REMOVE_COURSE_SUCCESS,
        REMOVE_COURSE_FAILURE,
      ],
      data: {
        course: courseName,
      },
    })
  }
}

export const getCourseInfo = (courseName: string) => {
  return async (dispatch: AppDispatch) => {
    return authRequestWithDispatch({
      dispatch,
      endpoint: 'get_course_info',
      method: 'POST',
      types: [GET_INFO_REQUEST, GET_INFO_SUCCESS, GET_INFO_FAILURE],
      data: {
        course: courseName,
      },
    })
  }
}

export const resetQueryCourses = () => {
  return { type: QUERY_COURSES_SUCCESS, payload: undefined }
}
