import ScreenLayout from '@components/ScreenLayout'
import { Text } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'

type Props = BottomTabScreenProps<
  RootAuthenticatedTabBarParamList,
  '/assistant'
>

const Assistant = (props: Props) => {
  return (
    <ScreenLayout>
      <Text>Assistant</Text>
    </ScreenLayout>
  )
}

export default Assistant
