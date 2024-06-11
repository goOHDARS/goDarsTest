import { combineReducers } from '@reduxjs/toolkit'
import user from './user'
import majors from './majors'
import courses from './courses'
import conversations from './conversations'

export type Error = {
  message: string
  status: number
}

export type BaseState = {
  loading: boolean
  error?: Error
}

export default combineReducers({
  user,
  majors,
  courses,
  conversations,
})
