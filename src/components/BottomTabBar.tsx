import { useAppSelector } from '@hooks/store'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useEffect, useState } from 'react'
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Home, Book, Clipboard, MessageSquare } from 'react-native-feather'

const bottomTabs = {
  '/app': {
    title: 'Home',
    icon: Home,
  },
  '/course-select': {
    title: 'Courses',
    icon: Book,
  },
  '/overview': {
    title: 'My Plan',
    icon: Clipboard,
  },
  '/assistant': {
    title: 'Assistant',
    icon: MessageSquare,
  },
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    elevation: 20,
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: -2 }, // Position the shadow above
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#fff', // Ensure background color to see the shadow
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 60,
    borderRadius: 20,
  },
})

const BottomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const [keyboardShown, setKeyboardShown] = useState(false)
  const onboarded = useAppSelector((state) => !!state.user.user?.onboarded)

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardShown(true)
    })

    const keyboardHiddenListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShown(false)
      }
    )

    return () => {
      keyboardShowListener.remove()
      keyboardHiddenListener.remove()
    }
  }, [])

  // only hide if android or not onboarded
  if ((keyboardShown && Platform.OS === 'android') || !onboarded) {
    return null
  }

  return (
    <View style={styles.container}>
      {state.routeNames.map((el, index) => {
        const routeName = el as
          | '/app'
          | '/course-select'
          | '/overview'
          | '/assistant'
        const focused = state.index == index
        const TabIcon = bottomTabs[routeName].icon

        const tabStyle: ViewStyle = {
          ...styles.tabContainer,
          ...(focused ? { backgroundColor: '#F2F2F2' } : {}),
        }
        const iconColor = focused ? '#039942' : '#1C1C1C'

        const handlePress = () => {
          if (!focused) {
            navigation.navigate(routeName)
          }
        }

        return (
          <TouchableOpacity key={index} style={tabStyle} onPress={handlePress}>
            <TabIcon color={iconColor} width={24} height={24} />
            <Text style={{ color: iconColor, marginTop: 5 }}>
              {bottomTabs[routeName].title}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default BottomTabBar
