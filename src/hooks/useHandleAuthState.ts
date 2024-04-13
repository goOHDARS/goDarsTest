import { useEffect } from 'react'
import { auth } from '@configs/firebase'
import { useAppDispatch, useAppSelector } from './store'
import { getCurrentUser } from '@actions/user'

const useHandleAuthState = () => {
  const dispatch = useAppDispatch()
  const userLoading = useAppSelector((state) => state.user.loading)

  useEffect(() => {
    // get current user on initial load if user is logged in
    auth.onAuthStateChanged((user) => {
      if (user && !userLoading) {
        dispatch(getCurrentUser())
      }
    })
  }, [])
}

export default useHandleAuthState
