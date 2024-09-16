import RNModal from 'react-native-modal'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Pressable,
  TextInput,
  Image,
  View,
  Text,
  TouchableOpacity } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { getCurrentUser, SET_USER_SUCCESS, updateUser } from '@actions/user'
import { X, Search, XCircle } from 'react-native-feather'
import { styles } from './styles'
import ColorCustomizer from './ColorCustomizer'

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


  const [hasChanges, setHasChanges] = useState(false)

  const autoCompleteDropDownRef = useRef<TextInput>(null)
  const opacity = useRef(new Animated.Value(0)).current

  const loading = useAppSelector((state) => state.user.loading)


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
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }).start()
    } else {
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
      setPokeData(pokeDataOriginal)
      return
    }
    if (pokeDataOriginal) {
      const newPokeResults: pokeResponse = { ...pokeDataOriginal }
      newPokeResults.results = newPokeResults.results?.filter((poke) => poke.name.includes(e))
      setPokeData(newPokeResults)
    }
  }

  const handleUpdateUser = async () => {
    if (hasChanges && user) {
      await dispatch(updateUser(user))
    }
  }

  if (!user) {
    return null
  }

  if (!viewProfileCustomizer) {
    return
  }

  return (
    <RNModal
      backdropTransitionOutTiming={450}
      backdropTransitionInTiming={750}
      animationInTiming={350}
      animationOutTiming={850}
      onBackButtonPress={() => {
        setViewProfileCustomizer(false)
      }}
      onBackdropPress={() => {
        Keyboard.dismiss(), handleUpdateUser(), setViewProfileCustomizer(false)
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
          setSearching(false)
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
            </View>
            : null }
          { !loading ?
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%'}}>
              <FlatList
                data={pokeData?.results}
                contentContainerStyle={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1, elevation: 1}}
                horizontal={false}
                numColumns={3}
                initialNumToRender={15}
                maxToRenderPerBatch={15}
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
              </View>
              <ColorCustomizer
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                setHasChanges={setHasChanges}
              >
              </ColorCustomizer>
            </View>
            : <View style={{ width: '100%', height: '50%', justifyContent: 'center' }}><ActivityIndicator color={'#039942'}></ActivityIndicator></View>}
        </ScreenLayout>
      </Animated.View>
    </RNModal>
  )
}
