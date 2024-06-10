import { signOutUser } from '@actions/user'
import ScreenLayout from '@components/ScreenLayout'
import {
  useAppDispatch,
  useAppSelector,
} from '@hooks/store'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native'
import React from 'react'
import UserYears from '@components/Semester'
import { CourseBrief } from 'src/reducers/courses'
import Button from '@components/Button'

type Props = BottomTabScreenProps<RootAuthenticatedTabBarParamList, '/app'>

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'red',
  },
  userImage: {
    display: 'flex',
    alignSelf: 'flex-end',
    width: 125,
    height: 125,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 100,
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    fontSize: 28,
    fontWeight: '200',
    fontFamily: '',
  },
  major: {
    fontSize: 16,
    fontWeight: '300',
  },
})

const MainPage = (props: Props) => {
  const user = useAppSelector((state) => state.user?.user)
  const dispatch = useAppDispatch()

  return (
    <ScreenLayout>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <View style={styles.userContainer}>
            <Text style={styles.username}>{user?.name}</Text>
            <Text style={styles.major}>{user?.major}</Text>
          </View>
          <Image
            style={styles.userImage}
            source={{ uri: user?.photoURL }}
            alt='user profile picture'
          />
        </View>
        <ScrollView contentContainerStyle={{ gap: 20}}>
          <UserYears />
        </ScrollView>
        <Button onPress={() => dispatch(signOutUser())} color="#039942">
          Logout
        </Button>
      </View>
    </ScreenLayout>
  )
}

export default MainPage
