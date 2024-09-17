import ScreenLayout from '@components/ScreenLayout'
import { Text } from 'react-native'

export default (
  {
    viewWhatIfDARS,
    setViewWhatIfDARS,
  }
  :
  {
    viewWhatIfDARS: boolean,
    setViewWhatIfDARS: React.Dispatch<React.SetStateAction<boolean>>
  }
) => {
  if (!viewWhatIfDARS) {
    return null
  }

  return (
    <ScreenLayout>
      <Text>What if DARS?</Text>
    </ScreenLayout>
  )
}
