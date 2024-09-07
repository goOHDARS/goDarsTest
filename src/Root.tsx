import useInitialDataLoader, { AppState } from '@hooks/useInitialDataLoader'
import UnauthenticatedRoot from './unauthenticated'
import AuthenticatedRoot from './authenticated'
import FullScreenLoader from '@components/FullScreenLoader'

const Root = () => {
  const mode = useInitialDataLoader()

  return {
    [AppState.Loading]: <FullScreenLoader />,
    [AppState.Authenticated]: <AuthenticatedRoot />,
    [AppState.Unauthenticated]: <UnauthenticatedRoot />,
  }[mode]
}

export default Root
