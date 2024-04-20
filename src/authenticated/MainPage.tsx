import { signOutUser } from '@actions/user'
import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch } from '@hooks/store'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'

type Props = BottomTabScreenProps<RootAuthenticatedTabBarParamList, '/app'>

const MainPage = (props: Props) => {
  const dispatch = useAppDispatch()

  return (
    <ScreenLayout>
      <Button onPress={() => dispatch(signOutUser())} color="#039942">
        Logout
      </Button>
    </ScreenLayout>
  )
}

export default MainPage
