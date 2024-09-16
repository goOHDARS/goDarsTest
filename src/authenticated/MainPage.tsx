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
  TouchableOpacity,
  Pressable,
} from 'react-native'
import React, { useRef, useState } from 'react'
import Onboarding from './Onboarding'
import Semesters from '@components/Semesters'
import Dashboard from './Dashboard/Dashboard'
import Profile from './Dashboard/Profile/Profile'

type Props = BottomTabScreenProps<RootAuthenticatedTabBarParamList, '/app'>

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    verticalAlign: 'middle',
    height: '15%',
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 20,
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: '#fff', // Ensure background color to see the shadow
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
    fontSize: 35,
    fontWeight: '100',
    textTransform: 'capitalize',
  },
  major: {
    fontSize: 20,
    fontWeight: '200',
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
  const scrollViewRef = useRef<ScrollView>(null)

  const [viewExtras, setViewExtras] = useState(false)
  const [viewProfile, setViewProfile] = useState(false)
  const [viewWhatIfDARS, setViewWhatIfDARS] = useState(false)
  const [viewFulfilledBricks, setViewFulfilledBricks] = useState(false)

  return {
    ...props,
    user,
    dispatch,
    scrollViewRef,
    viewExtras,
    viewProfile,
    viewWhatIfDARS,
    viewFulfilledBricks,
    setViewExtras,
    setViewProfile,
    setViewWhatIfDARS,
    setViewFulfilledBricks,
  }
}

const MainPageRoot = (props: ReturnType<typeof useViewModel>) => {
  return props.user?.onboarded ? (
    <ScreenLayout extraStyles={{ backgroundColor: '#fff'}}>
      <View style={styles.headerContainer}>
        <View style={styles.userContainer}>
          <Text style={styles.username}>{props.user?.name}</Text>
          <Text style={styles.major}>{props.user?.major}</Text>
        </View>
        <TouchableOpacity style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, width: 90, height: 90 }} onPress={() => {
          props.setViewExtras(!props.viewExtras), console.log(props.user?.photoURL)
        }}>
          <Image
            style={[styles.userImage, { borderColor: props.user.borderURLColor}]}
            source={{ uri: props.user?.photoURL }}
            alt="user profile picture"
          ></Image>
        </TouchableOpacity>
      </View>
      <ScrollView
        nestedScrollEnabled={true}
        ref={props.scrollViewRef}
        onScrollBeginDrag={() => {
          props.viewExtras ? props.setViewExtras(false) : undefined
        }}>
        <Pressable style={{ gap: 20, paddingBottom: 50, paddingTop: 25}}>
          <Semesters />
        </Pressable>
      </ScrollView>
      <Dashboard
        viewExtras={props.viewExtras} setViewExtras={props.setViewExtras}
        viewProfile={props.viewProfile} setViewProfile={props.setViewProfile}
        viewFulfilledBricks={props.viewFulfilledBricks} setViewFulfilledBricks={props.setViewFulfilledBricks}
        viewWhatIfDARS={props.viewWhatIfDARS} setViewWhatIfDARS={props.setViewWhatIfDARS}></Dashboard>
      <Profile
        viewProfile={props.viewProfile} setViewProfile={props.setViewProfile}
      >
      </Profile>
      {/* <Button onPress={() => dispatch(signOutUser())} color="#039942">
        Logout
      </Button> */}
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
