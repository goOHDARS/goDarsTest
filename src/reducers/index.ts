import { combineReducers } from '@reduxjs/toolkit'
import user from './user'
import majors from './majors'

export type Error = {
  message: string
  status: number
}

export type BaseState = {
  loading: boolean
  error?: Error
}

export type Course = {
  id: string
  college: string
  credits: number
  description: string
  fullName: string
  prereq: string[]
  semester: string
  shortName: string
}


export default combineReducers({
  user,
  majors,
})
