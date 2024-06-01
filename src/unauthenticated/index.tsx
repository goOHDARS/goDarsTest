import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LandingScreen from './LandingScreen'
import SignUpScreen from './SignUpScreen'
import AdditionalInfoScreen from './AdditionalInfoScreen'
import SignInScreen from './SignInScreen'
import { useAppSelector } from '@hooks/store'
import { useEffect } from 'react'
import Onboarding from './Onboarding'
import { CourseBrief } from 'src/reducers/courses'

export type RootUnauthenticatedStackParamList = {
  '/landing': undefined
  '/signup': undefined
  '/additional-info': { name: string; email: string; password: string }
  '/signin': undefined
}

const UnauthenticatedStack =
  createNativeStackNavigator<RootUnauthenticatedStackParamList>()

type Props = {
  firstTimeUser: boolean
}

const UnauthenticatedRoot = ({ firstTimeUser }: Props) => {
  const initialRouteName = firstTimeUser ? '/landing' : '/signin'
  const onboarded = useAppSelector((state) => state.user?.user?.onboarded)
  const isOnboarded = onboarded ? '/signin' : '/onboarding'

  return (
    <UnauthenticatedStack.Navigator
      screenOptions={{ headerShown: false, animation: 'none' }}
      initialRouteName={initialRouteName}
    >
      <UnauthenticatedStack.Screen name="/landing" component={LandingScreen} />
      <UnauthenticatedStack.Screen name="/signup" component={SignUpScreen} />
      <UnauthenticatedStack.Screen
        name="/additional-info"
        component={AdditionalInfoScreen}
      />
      <UnauthenticatedStack.Screen name="/signin" component={SignInScreen} />
    </UnauthenticatedStack.Navigator>
  )
}

export default UnauthenticatedRoot
