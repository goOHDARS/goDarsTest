import { signOutUser } from '@actions/user'
import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch } from '@hooks/store'
import { Text } from 'react-native'

const MainPage = () => {
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
