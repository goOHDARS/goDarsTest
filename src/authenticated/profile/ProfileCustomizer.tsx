import RNModal from 'react-native-modal'
import ColorPicker, { Panel1, Swatches, Preview, HueSlider } from 'reanimated-color-picker'
import { signOut, updateProfile } from 'firebase/auth'
import { CourseBrief } from 'src/reducers/courses'
import { ActivityIndicator, Alert, Animated, FlatList, Keyboard, Pressable, TextInput, Image, Modal, View, Text, TouchableOpacity } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { GET_USER_REQUEST, getCurrentUser, SET_USER_SUCCESS, updateUser } from '@actions/user'
import { X, Search, XCircle } from 'react-native-feather'
import { styles } from './styles'
import Button from '@components/Button'

export type pokeResponse = {
  count: number,
  next: string,
  previous: string,
  results: Array<{name: string, url: string}>
}

export default (
  {viewProfileCustomizer, setViewProfileCustomizer, pokeData, setPokeData, pokeDataOriginal, setPokeDataOriginal, searching, setSearching}
  :
  {viewProfileCustomizer: boolean, setViewProfileCustomizer: React.Dispatch<React.SetStateAction<boolean>>, pokeData?: pokeResponse, setPokeData: React.Dispatch<React.SetStateAction<pokeResponse | undefined>>, pokeDataOriginal?: pokeResponse, setPokeDataOriginal: React.Dispatch<React.SetStateAction<pokeResponse | undefined>>, searching: boolean, setSearching: React.Dispatch<React.SetStateAction<boolean>>}
) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)

  const translation = useRef(new Animated.Value(0)).current

  const [query, setQuery] = useState('')
  const [scrolling, setScrolling] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [colorPicked, setColorPicked] = useState<any>()

  const [hasChanges, setHasChanges] = useState(false)

  const autoCompleteDropDownRef: React.LegacyRef<TextInput> = useRef(null)
  const opacity = useRef(new Animated.Value(0)).current

  const loading = useAppSelector((state) => state.user.loading)

  if (!user) {
    return null
  }

  const handleSelectColor = ({hex} : any) => {
    if (hex !== '#ffffff') {
      dispatch({
        type: SET_USER_SUCCESS,
        payload: {
          ...user,
          borderURLColor: hex,
        },
      })
      console.log(hex)
      setHasChanges(true)
    }
  }

  const updatePokeData = (item: {name: string, url: string}) => {
    if (pokeData) {
      const index = pokeData.results.findIndex((poke) => poke.url === item.url)
      pokeData.results[0] = pokeData.results[index]
      setPokeData(pokeData)
    }
  }

  useEffect(() => {
    if (searching) {
      Animated.timing(translation, {
        toValue: -200,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(translation, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }

    if (scrolling) {
      console.log('scrolling')
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start()
    } else {
      console.log('not scrolling')
      Animated.timing(opacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start()
    }
  }, [searching, scrolling])

  const handleSetQuery = (e: string) => {
    setQuery(e)

    if (e === '') {
      console.log(pokeDataOriginal)
      setPokeData(pokeDataOriginal)
      return
    }
    if (pokeDataOriginal) {
      const newPokeResults: pokeResponse = { ...pokeDataOriginal }
      newPokeResults.results = newPokeResults.results?.filter((poke) => poke.name.includes(e))
      setPokeData(newPokeResults)

      console.log(newPokeResults.results?.length)
    }
  }

  const handleUpdateUser = () => {
    if (hasChanges) {
      console.log('semester: ', user.semester)
      dispatch(updateUser(user))
    }
  }

  return (
    <RNModal
      backdropTransitionOutTiming={450}
      backdropTransitionInTiming={750}
      animationOutTiming={850}
      animationInTiming={350}
      onBackButtonPress={() => {
        setViewProfileCustomizer(false)
      }}
      onBackdropPress={() => {
        Keyboard.dismiss(), setViewProfileCustomizer(false), handleUpdateUser()
      }}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={viewProfileCustomizer}
      style={{ alignItems: 'flex-end', justifyContent: 'flex-end', margin: 0}}>
      <Animated.View style={{ width: '100%', height: '60%', backgroundColor: 'white', borderRadius: 10, transform: [
        {translateY: translation},
        {perspective: 1000}], // without this line this Animation will not render on Android while working fine on iOS
      }}>
        {/* smh safeAreaView borderradius cockblocking me */}
        <ScreenLayout onDismissFunc={() => {
          setSearching(false), console.log('screenlayout ondismissfunc')
        }} extraStyles={{ borderRadius: 10 }} style={{ justifyContent: 'flex-start'}}>
          <View style={styles.modalHeaderContainer1}>
            <View style={{ display: 'flex', flexDirection: 'row', marginHorizontal: 20}}>
              <Text style={{ fontSize: 20, fontWeight: '300' }}>Choose your</Text>
              <Text style={{ fontSize: 20, fontWeight: '600', color: 'red' }}> Pokémon</Text>
              <Text style={{ fontSize: 20, fontWeight: '300' }}>!</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setViewProfileCustomizer(false)
            }} style={styles.xButton}>
              <X color={'gray'} strokeWidth={3} width={25} height={25} style={{ zIndex: 0, elevation: 0 }}></X>
            </TouchableOpacity>
          </View>

          {!loading ?
            <View style={styles.textBox}>
              <View style={styles.disabledInputTextContainer}>
                <Search color={'#ffffff'} strokeWidth={3}></Search>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', width: '90%', borderRadius: 10, alignItems: 'center'}}>
                <TextInput
                  style={[styles.textBoxInput, { width: searching ? '90%' : '100%'}]}
                  placeholder={'Charizard...'}
                  placeholderTextColor={'#BBBBBB'}
                  onChangeText={(e) => handleSetQuery(e)}
                  ref={autoCompleteDropDownRef}
                  onPressIn={() => {
                    setSearching(true)
                  }}
                  onEndEditing={() => {
                    setSearching(false)
                  }}
                  value={query}
                >
                </TextInput>

                {searching ?
                  <TouchableOpacity onPress={ query === '' ? () => undefined : () => {
                    handleSetQuery(''), setPokeData(pokeDataOriginal)
                  }} style={{ width: '10%'}}>
                    <XCircle width={20} color={'gray'}></XCircle>
                  </TouchableOpacity> : null
                }
              </View>
              {/* <AutocompleteDropdown
                onChangeText={(e) => handleSetQuery(e)}
                ref={autoCompleteDropDownRef}
                onFocus={autoCompleteDropDownRef.current?.isFocsused ? () => {setSearching(true), console.log('focused')} : () => {setSearching(false), console.log('not focused')}}
                containerStyle={styles.textBoxInput}
                textInputProps={{
                  style: styles.dropDownText,
                  placeholder: 'Charizard...',
                  placeholderTextColor: '#BBBBBB',
                }}
                onSubmit={() => {setSearching(false)}}
                inputContainerStyle={styles.dropDownInput}
                rightButtonsContainerStyle={{ height: 50 }}
                showClear={searching}
                onClear={() => {setSearching(false), setQuery(''), setPokeData(pokeDataOriginal)}}
                clearOnFocus={false}
                useFilter={true}
                closeOnSubmit={false}
                showChevron={false}
                direction={Platform.select({ ios: 'down' })}
              /> */}
            </View>
            : null }
          { !loading ?
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%'}}>
              <FlatList
                data={pokeData?.results}
                contentContainerStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1, elevation: 1}}
                horizontal={false}
                numColumns={3}
                initialNumToRender={25}
                maxToRenderPerBatch={25}
                onMomentumScrollBegin={() => {
                  setScrolling(true)
                }}
                onMomentumScrollEnd={() => {
                  setScrolling(false)
                }}
                updateCellsBatchingPeriod={5000}
                // onScroll={(event) => {}}
                key={pokeData?.results.length}
                renderItem={({item, index}) => {
                  return (
                    <Pressable onPress={() => {
                      dispatch({type: SET_USER_SUCCESS, payload: {
                        ...user,
                        photoURL: item.url,
                      }}), updatePokeData(item), setSearching(false), setHasChanges(true)
                    }} style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}} key={index}>
                      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: 100, borderWidth: 1, borderColor: (index === 0 ? user?.borderURLColor : 'black')}}>
                        <Image
                          source={{ uri: item.url}}
                          alt='pokemon image'
                          style={{ width: 70, height: 70}}
                        />
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: '200'}}>{item.name}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '200'}}>{index !== 0 ? '\u{FE5F}' : ''}{index !== 0 ? index : ''}</Text>
                    </Pressable>
                  )
                }}
              />
              <View style={{ display: 'flex', flexDirection: 'column', width: '25%', alignItems: 'center'}}>
                <Text style={{ fontSize: 10}}>Pick your favorite color</Text>
                <Pressable
                  onPress={() => {
                    setIsVisible(true)
                  }}
                  style={{ display: 'flex', borderRadius: 100, borderWidth: 1, width: 30, height: 30, marginVertical: 20,
                    backgroundColor:
                      user?.borderURLColor === '' ||
                      user?.borderURLColor === '#000000' ||
                      user?.borderURLColor === '#ffffff' ||
                      user?.borderURLColor === '#fff' ||
                      user?.borderURLColor === undefined
                        ? 'hotpink' : user.borderURLColor }}>
                </Pressable>
                {/* <Pressable onPress={() => {}}>

                </Pressable> */}
              </View>
              <Modal animationType='slide' visible={isVisible} presentationStyle='pageSheet' onRequestClose={() => {
                setIsVisible(false), handleSelectColor(colorPicked)
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
            </View>
            : <View style={{ width: '100%', height: '50%', justifyContent: 'center' }}><ActivityIndicator color={'#039942'}></ActivityIndicator></View>}
        </ScreenLayout>
      </Animated.View>
    </RNModal>
  )
}
