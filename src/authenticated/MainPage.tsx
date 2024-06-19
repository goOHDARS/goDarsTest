import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
  Animated,
  Keyboard,
  Alert,
} from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Semesters from '@components/Semesters/Semesters'
import Onboarding from './Onboarding/Onboarding'
import Dashboard from '@components/Dashboard'
import { ArrowUp, Edit2, Search, Trash2, X, XCircle } from 'react-native-feather'
import Button from '@components/Button'
import { GET_USER_REQUEST, SET_USER_SUCCESS } from '@actions/user'
import RNModal from 'react-native-modal'
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker'

type Props = BottomTabScreenProps<RootAuthenticatedTabBarParamList, '/app'>

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '20%',
    alignContent: 'center',
    verticalAlign: 'middle',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
  },
  userImage: {
    display: 'flex',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderRadius: 100,
    position: 'absolute',
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    fontSize: 28,
    fontWeight: '200',
    textTransform: 'capitalize',
  },
  major: {
    fontSize: 16,
    fontWeight: '300',
  },
  xButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderRadius: 100,
  },
  modalHeaderContainer1: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  dropDownText: {
    fontSize: 20,
    height: 50,

  },
  dropDownInput: {
    borderRadius: 10,
    backgroundColor: '#ffffff00',
    width: '100%',
  },
  textBoxInput: {
    display: 'flex',
    fontSize: 20,
    height: 50,
    paddingHorizontal: 10,
  },
  textBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: '5%',
    width: '90%',
    borderWidth: 1,
    borderColor: '#039942',
    borderRadius: 10,
    height: 50,
  },
  disabledInputTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#039942',
    height: 50,
    width: 40,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
})

export type pokeResponse = {
  count: number,
  next: string,
  previous: string,
  results: Array<{name: string, url: string}>
}

const MainPage = (props: Props) => {
  const user = useAppSelector((state) => state.user?.user)
  const loading = useAppSelector((state) => state.user.loading)

  const dispatch = useAppDispatch()

  const scrollViewRef = useRef<ScrollView>(null)

  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [searching, setSearching] = useState(false)
  const [viewExtras, setViewExtras] = useState(false)
  const [viewProfile, setViewProfile] = useState(false)
  const [colorPicked, setColorPicked] = useState<any>()
  const [viewWhatIfDARS, setViewWhatIfDARS] = useState(false)
  const [viewFulfilledBricks, setViewFulfilledBricks] = useState(false)
  const [viewProfilePictures, setViewProfilePictures] = useState(false)

  const autoCompleteDropDownRef: React.LegacyRef<TextInput> = useRef(null)
  const [pokeDataOriginal, setPokeDataOriginal] = useState<pokeResponse>()
  const [pokeData, setPokeData] = useState<pokeResponse>()
  const translation = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current

  const fetchData = async () => {
    dispatch({
      type: GET_USER_REQUEST,
    })

    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      const pokeData = await response.json()

      if (pokeData && response.ok && user) {
        const pokeDataTyped = pokeData as pokeResponse

        let i = pokeDataTyped.results.length - 1
        while (i > 0 && pokeDataTyped.results[i].url !== user?.photoURL) {
          pokeDataTyped.results[i].url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`
          pokeDataTyped.results[i].name = pokeDataTyped.results[i - 1].name
          i--
        }

        if (pokeDataTyped.results[i].url === user.photoURL) {
          i -= 1
          while (i > 0) {
            pokeDataTyped.results[i].url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`
            pokeDataTyped.results[i].name = pokeDataTyped.results[i - 1].name
            i--
          }
        }

        if (user) {
          const index = pokeDataTyped.results.findIndex((poke) => poke.url === user.photoURL)
          pokeDataTyped.results[0] = pokeDataTyped.results[index]
        }

        setPokeData(pokeDataTyped)
        setPokeDataOriginal(pokeDataTyped)
        dispatch({
          type: SET_USER_SUCCESS,
          payload: {
            ...user,
          },
        })
      }
    } catch (error: any) {
      dispatch({
        type: SET_USER_SUCCESS,
        payload: {
          ...user,
        },
      })
      setViewProfilePictures(false)
      Alert.alert('goOHDARS', 'Couldn\'t perform that action. Please try again later.', [
        {
          text: 'Confirm',
          style: 'default',
        },
      ])

      console.log(error.message)
    }
  }

  const saveChanges = () => {
    dispatch({
      type: SET_USER_SUCCESS,
      payload: {
        ...user,
      },
    })
  }

  const handleSetName = (e: string) => {
    if (isNaN(+e) && !e.match(/[^A-Za-z0-9]/)) {
      console.log(isNaN(+e))
      setName(e)
      console.log(name)
    }
  }

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

  return user?.onboarded ? (
    <ScreenLayout>
      <View style={styles.headerContainer}>
        <View style={styles.userContainer}>
          <Text style={styles.username}>{user?.name}</Text>
          <Text style={styles.major}>{user?.major}</Text>
        </View>
        <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, width: 90, height: 90 }} onPress={() => {
          setViewExtras(!viewExtras), console.log(user.photoURL)
        }}>
          <Image
            style={[styles.userImage, { borderColor: user.borderURLColor}]}
            source={{ uri: user?.photoURL }}
            alt="user profile picture"
          ></Image>
        </TouchableOpacity>
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        ref={scrollViewRef}
        onScrollBeginDrag={() => {
          viewExtras ? setViewExtras(false) : undefined
        }}>
        <Pressable style={{ gap: 20}}>
          <Semesters />
        </Pressable>
      </ScrollView>
      <Modal animationType='slide' visible={viewProfile}
        onRequestClose={() => setViewProfile(false)} presentationStyle='pageSheet'>
        <ScreenLayout>
          <View style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', gap: 20}}>
            <View style={{ width: '10%', height: 3, backgroundColor: 'gray', alignSelf: 'center', marginTop: 5, borderRadius: 100}}>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', alignSelf: 'center', gap: 10, height: '15%', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 32, fontWeight: '100', textTransform: 'capitalize'}}>{user.name}</Text>
              <TouchableOpacity onPress={async () => {
                await fetchData(), setViewProfilePictures(true), setSearching(false)
              }}>
                <Image
                  style={{ width: 90, height: 90, borderRadius: 100, borderColor: user.borderURLColor, borderWidth: 1, alignSelf: 'flex-end'}}
                  source={{ uri: user?.photoURL }}
                  alt="user profile picture"
                ></Image>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Edit2 color='black' width={15} height={15}></Edit2>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10, height: '60%', marginHorizontal: 30}}>
              <View style={{ display: 'flex', flexDirection: 'row', width: '100%'}}>
                <Text style={{ fontSize: 20, fontWeight: '600'}}>Username: </Text>
                <TextInput autoCapitalize='none' autoComplete='name' style={{ fontSize: 20, width: '60%' }} placeholder='edit me' inputMode='text' onChangeText={(e) => {
                  handleSetName(e), console.log(name)
                }}>{name}</TextInput>
              </View>
              <Text style={{fontSize: 20}}>{user.pid}</Text>
              <Text style={{fontSize: 20}}>{user.email}</Text>
              <Text style={{fontSize: 20}}>Credits: {user.credits}</Text>
              <Text style={{fontSize: 20, fontWeight: '500', color: 'red'}}>Reset Password</Text>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <Trash2 color='red' width={25} height={25} strokeWidth={3}></Trash2>
                <Text style={{fontSize: 14, fontWeight: '700', color: 'red'}}>
                    Delete Account
                </Text>
              </View>
            </View>
            <RNModal
              backdropTransitionOutTiming={450}
              backdropTransitionInTiming={750}
              animationOutTiming={850}
              animationInTiming={350}
              onBackButtonPress={() => {
                setViewProfilePictures(false)
              }}
              onBackdropPress={() => {
                Keyboard.dismiss(), setViewProfilePictures(false), console.log('backdrop press')
              }}
              animationIn={'slideInUp'}
              animationOut={'slideOutDown'}
              isVisible={viewProfilePictures}
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
                      setViewProfilePictures(false)
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
                        onFocus={autoCompleteDropDownRef.current?.isFocused ? () => {setSearching(true), console.log('focused')} : () => {setSearching(false), console.log('not focused')}}
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
                              }}), updatePokeData(item), setSearching(false)
                            }} style={{ width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}} key={index}>
                              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: 100, borderWidth: 1, borderColor: (index === 0 ? user.borderURLColor : 'black')}}>
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
                        user.borderURLColor === '' ||
                        user.borderURLColor === '#000000' ||
                        user.borderURLColor === '#ffffff' ||
                        user.borderURLColor === '#fff' ||
                        user.borderURLColor === undefined
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
                            <ColorPicker sliderThickness={25} thumbSize={25} onChange={() => {
                              setColorPicked
                            }} thumbShape='circle' boundedThumb={true} style={{ height: '60%', width: '90%'}} value='red'>
                              <Preview />
                              <Panel1 />
                              <HueSlider />
                              <Swatches style={{marginTop: 20}} />
                            </ColorPicker>
                            <View style={{ width: '90%', height: '25%', gap: 10, justifyContent: 'flex-end'}}>
                              <Text style={{ fontSize: 13, alignSelf: 'center'}}>Picking a color may take a few seconds...</Text>
                              <Button loading={loading} disabled={colorPicked === user.borderURLColor} onPress={() => {
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
            {/* <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 5, width: '75%', alignItems: 'center'}}>
                <HelpCircle color={'black'} width={20} height={20}></HelpCircle>
                <Text>Users who scan this QR Code can view your planned schedule.</Text>
              </View>
              <Image
                style={{ width: '45%', height: '25%', borderColor: 'black', borderWidth: 2, alignSelf: 'center', borderRadius: 20}}
                source={require('../../assets/image.png')}
                alt="user profile picture"
              ></Image> */}
          </View>
        </ScreenLayout>
      </Modal>
      <Dashboard
        viewExtras={viewExtras} setViewExtras={setViewExtras}
        viewProfile={viewProfile} setViewProfile={setViewProfile}
        viewFulfilledBricks={viewFulfilledBricks} setViewFulfilledBricks={setViewFulfilledBricks}
        viewWhatIfDARS={viewWhatIfDARS} setViewWhatIfDARS={setViewWhatIfDARS}></Dashboard>
      {/* <Button onPress={() => dispatch(signOutUser())} color="#039942">
        Logout
      </Button> */}
    </ScreenLayout>
  ) : (
    <Onboarding />
  )
}

export default MainPage

// <Pressable onPress={() => {setSearching(false), console.log('pressing on flatlist')}} style={{ width: '90%', height: '60%', justifyContent: 'flex-end'}}>
//   <Animated.View style={{ display: 'flex', position: 'absolute', zIndex: 1, elevation: 1, alignSelf: 'center', backgroundColor: 'lightgray', borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: opacity}}>
//     <ArrowUp color={'black'} width={25} height={25} strokeWidth={3}></ArrowUp>
//   </Animated.View>
// </Pressable>
