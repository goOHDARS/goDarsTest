import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Animated,
  Alert,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Onboarding from './Onboarding'
import Button from '@components/Button'
import { GET_USER_REQUEST, SET_USER_SUCCESS, signOutUser } from '@actions/user'
import UserYears from '@components/Semesters'

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

const useViewModel = (props: Props) => {
  const user = useAppSelector((state) => state.user?.user)

  const dispatch = useAppDispatch()

  const [isVisible, setIsVisible] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const [searching, setSearching] = useState(false)

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
      // setViewProfilePictures(false)
      Alert.alert('goOHDARS', 'Couldn\'t perform that action. Please try again later.', [
        {
          text: 'Confirm',
          style: 'default',
        },
      ])

      console.log(error.message)
    }
  }

  const updatePokeData = (item: {name: string, url: string}) => {
    if (pokeData) {
      const index = pokeData.results.findIndex((poke) => poke.url === item.url)
      pokeData.results[0] = pokeData.results[index]
      setPokeData(pokeData)
    }
  }

  const handleUserSignOut = () => {
    dispatch(signOutUser())
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

  return { ...props, user, dispatch, handleUserSignOut }
}

const MainPageRoot = (props: ReturnType<typeof useViewModel>) => {
  return props.user?.onboarded ? (
    <ScreenLayout>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <View style={styles.userContainer}>
            <Text style={styles.username}>{props.user?.name}</Text>
            <Text style={styles.major}>{props.user?.major}</Text>
          </View>
          <Image
            style={styles.userImage}
            source={{ uri: props.user?.photoURL }}
            alt="user profile picture"
          />
        </View>
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <UserYears />
        </ScrollView>
        <Button onPress={() => props.handleUserSignOut} color="#039942">
          Logout
        </Button>
      </View>
    </ScreenLayout>
  ) : (
    <Onboarding />
  )
}

const MainPage = (props: Props) => {
  const viewModel = useViewModel(props)
  return <MainPageRoot {...viewModel} />
}

export default MainPage

// <Pressable onPress={() => {setSearching(false), console.log('pressing on flatlist')}} style={{ width: '90%', height: '60%', justifyContent: 'flex-end'}}>
//   <Animated.View style={{ display: 'flex', position: 'absolute', zIndex: 1, elevation: 1, alignSelf: 'center', backgroundColor: 'lightgray', borderRadius: 100, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', opacity: opacity}}>
//     <ArrowUp color={'black'} width={25} height={25} strokeWidth={3}></ArrowUp>
//   </Animated.View>
// </Pressable>
