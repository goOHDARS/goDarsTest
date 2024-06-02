import useHandleAuthState from '@hooks/useHandleAuthState'
import UnauthenticatedRoot from './unauthenticated'
import AuthenticatedRoot from './authenticated'
import { useAppSelector } from '@hooks/store'
import FullScreenLoader from '@components/FullScreenLoader'
import Onboarding from './authenticated/Onboarding'

const Root = () => {
  const user = useAppSelector((state) => state.user.user)

  const { loaded, firstTimeUser } = useHandleAuthState()

  return (
    <>
      {loaded ? (
        user ? (
          user?.onboarded ? (
            <AuthenticatedRoot />
          ) : (
            <Onboarding />
          )
        ) : (
          <UnauthenticatedRoot firstTimeUser={firstTimeUser} />
        )
      ) : (
        <FullScreenLoader />
      )}
    </>
  )
}

export default Root
