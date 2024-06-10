import ScreenLayout from '@components/ScreenLayout'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'
import ChatScreen from '@components/ChatScreen'

type Props = BottomTabScreenProps<
  RootAuthenticatedTabBarParamList,
  '/assistant'
>

const Assistant = (props: Props) => {
  return (
    <ScreenLayout>
      <ChatScreen />
    </ScreenLayout>
  )
}

export default Assistant
