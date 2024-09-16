import ScreenLayout from '@components/ScreenLayout'
import { Modal, View, Text } from 'react-native'
import ColorPicker, { Preview, Panel1, HueSlider, Swatches } from 'reanimated-color-picker'
import Button from '@components/Button'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { SET_USER_SUCCESS } from '@actions/user'

export default (
  {
    isVisible,
    setIsVisible,
    setHasChanges,
  }
  :
  {
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setHasChanges: React.Dispatch<React.SetStateAction<boolean>>}
) => {
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.user.loading)
  const user = useAppSelector((state) => state.user.user)

  const [colorPicked, setColorPicked] = useState<any>()

  const handleSelectColor = ({hex} : any) => {
    if (hex !== '#ffffff') {
      dispatch({
        type: SET_USER_SUCCESS,
        payload: {
          ...user,
          borderURLColor: hex,
        },
      })
      setHasChanges(true)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <Modal
      animationType='slide'
      visible={isVisible}
      presentationStyle='pageSheet'
      onRequestClose={() => {
        setIsVisible(false), handleSelectColor(colorPicked ? colorPicked : user?.borderURLColor)
      }}>
      <ScreenLayout>
        <View style={{ width: '100%', height: '100%', alignItems: 'center', gap: 40}}>
          <View style={{ width: '10%', height: 3, backgroundColor: 'gray', marginTop: 5, borderRadius: 100}}>
          </View>
          <ColorPicker onComplete={setColorPicked} sliderThickness={25} thumbSize={25}
            thumbShape='circle'
            boundedThumb={true}
            style={{ height: '60%', width: '90%'}}
            value='red'>

            <Preview />
            <Panel1 />
            <HueSlider />
            <Swatches style={{marginTop: 20}} />
          </ColorPicker>
          <View style={{ width: '90%', height: '25%', gap: 10, justifyContent: 'flex-end'}}>
            <Text style={{ fontSize: 13, alignSelf: 'center'}}>Picking a color may take a few seconds...</Text>
            <Button loading={loading} disabled={colorPicked === user?.borderURLColor} onPress={() => {
              setIsVisible(false), handleSelectColor(colorPicked)
            }}>
              Save Changes
            </Button>
          </View>
        </View>
      </ScreenLayout>
    </Modal>
  )
}
