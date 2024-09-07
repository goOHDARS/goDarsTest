import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LandingScreen from './LandingScreen'
import SignUpScreen from './SignUpScreen'
import AdditionalInfoScreen from './AdditionalInfoScreen'
import SignInScreen from './SignInScreen'
import { useEffect, useState } from 'react'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import FullScreenLoader from '@components/FullScreenLoader'

export type RootUnauthenticatedStackParamList = {
  '/landing': undefined
  '/signup': undefined
  '/additional-info': { name: string; email: string; password: string }
  '/signin': undefined
}

const UnauthenticatedStack =
  createNativeStackNavigator<RootUnauthenticatedStackParamList>()

const UnauthenticatedRoot = () => {
  const [initialRouteName, setInitialRouteName] =
    useState<keyof RootUnauthenticatedStackParamList>()

  useEffect(() => {
    ReactNativeAsyncStorage.getItem('has_visited').then((hasVisited) => {
      setInitialRouteName(hasVisited ? '/signin' : '/landing')
    })
  }, [])

  if (!initialRouteName) {
    return <FullScreenLoader />
  }

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
