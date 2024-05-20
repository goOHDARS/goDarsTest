import { useEffect, useState } from 'react'
import { auth } from '@configs/firebase'
import { useAppDispatch } from './store'
import { getCurrentUser } from '@actions/user'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getMajorsList } from '@actions/majors'

const useHandleAuthState = () => {
  const dispatch = useAppDispatch()
  const [loaded, setLoaded] = useState(false)
  const [firstTimeUser, setFirstTimeUser] = useState(true)

  useEffect(() => {
    // get current user on initial load if user is logged in
    auth.onAuthStateChanged(async (user) => {
      const hasVisitied = await ReactNativeAsyncStorage.getItem('has_visited')
      setFirstTimeUser(!(hasVisitied ?? false))

      // section to get data needed for initial boot
      if (!loaded) {
        await dispatch(getMajorsList())
      }

      if (user && user.displayName) {
        await dispatch(getCurrentUser())
        setLoaded(true)
      } else {
        setLoaded(true)
      }
    })
  }, [])

  return {
    loaded,
    firstTimeUser,
  }
}

export default useHandleAuthState
