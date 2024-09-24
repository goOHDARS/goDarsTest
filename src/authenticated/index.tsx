import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MainPage from './pages/MainPage'
import CourseSelect from './pages/CourseSelect'
import Overview from './pages/Overview'
import BottomTabBar from '@components/BottomTabBar'
import Assistant from './pages/Assistant'

export type RootAuthenticatedTabBarParamList = {
  '/app': undefined
  '/course-select': undefined
  '/overview': undefined
  '/assistant': undefined
}

const App = createBottomTabNavigator<RootAuthenticatedTabBarParamList>()

const AuthenticatedRoot = () => {
  return (
    <App.Navigator
      initialRouteName="/app"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <App.Screen name="/app" component={MainPage} />
      <App.Screen name="/course-select" component={CourseSelect} />
      <App.Screen name="/overview" component={Overview} />
      <App.Screen name="/assistant" component={Assistant} />
    </App.Navigator>
  )
}

export default AuthenticatedRoot
