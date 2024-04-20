import ScreenLayout from '@components/ScreenLayout'
import { Text } from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'

type Props = BottomTabScreenProps<
  RootAuthenticatedTabBarParamList,
  '/course-select'
>

const CourseSelect = (props: Props) => {
  return (
    <ScreenLayout>
      <Text>Course Select</Text>
    </ScreenLayout>
  )
}

export default CourseSelect
