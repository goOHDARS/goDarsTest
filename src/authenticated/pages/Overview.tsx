import ScreenLayout from '@components/ScreenLayout'
import { Text } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '..'

type Props = BottomTabScreenProps<RootAuthenticatedTabBarParamList, '/overview'>

const Overview = (props: Props) => {
  return (
    <ScreenLayout>
      <Text>Overview</Text>
    </ScreenLayout>
  )
}

export default Overview
