import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MainPage from './MainPage'
import CourseSelect from './CourseSelect'
import Overview from './Overview'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const App = createBottomTabNavigator()

const AuthenticatedRoot = () => {
  ReactNativeAsyncStorage.setItem('has_visited', 'true')

  return (
    <App.Navigator
      initialRouteName="/app"
      screenOptions={{ headerShown: false }}
    >
      <App.Screen name="/app" component={MainPage} />
      <App.Screen name="/course-select" component={CourseSelect} />
      <App.Screen name="/overview" component={Overview} />
    </App.Navigator>
  )
}

export default AuthenticatedRoot
