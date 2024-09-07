import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from './store'
import { getCurrentUser, setLoggedIn } from '@actions/user'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getMajorsList } from '@actions/majors'
import { getCourses } from '@actions/courses'

export enum AppState {
  Loading,
  Authenticated,
  Unauthenticated,
}

const useInitialDataLoader = () => {
  const dispatch = useAppDispatch()
  const [loaded, setLoaded] = useState(false)
  const userLoaded = useAppSelector((state) => !!state.user?.user)
  const loggedIn = useAppSelector((state) => state.user.loggedIn)

  const getMode = () => {
    if (loaded) {
      return loggedIn ? AppState.Authenticated : AppState.Unauthenticated
    }

    return AppState.Loading
  }

  useEffect(() => {
    // whenever user changes
    const fetchUserData = async () => {
      if (!userLoaded) {
        setLoaded(false)

        // fetch user dependent data
        await dispatch(getCurrentUser())
        await dispatch(getCourses())

        setLoaded(true)
      }
    }

    if (loggedIn) {
      fetchUserData()
    }
  }, [loggedIn])

  useEffect(() => {
    const fetchIndependentData = async () => {
      const loggedInKey = await ReactNativeAsyncStorage.getItem('logged_in')

      // fetch data not dependent on user
      await dispatch(getMajorsList())

      if (loggedInKey) {
        dispatch(setLoggedIn())
      } else {
        setLoaded(true)
      }
    }

    fetchIndependentData()
  }, [])

  return getMode()
}

export default useInitialDataLoader
