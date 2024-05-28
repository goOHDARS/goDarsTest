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
import Year from '@components/Semester'
import { Course } from 'src/reducers'

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
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)

  const course: Course = {
    id: '1',
    college: 'Russ College of Engineering',
    credits: 4,
    description: ('Introductory course in computer science. Topics include problem solving, '
    + 'algorithm design, and data structures.'),
    // why lint, why 100 max-len??!?!?!?!?!??!??!?!??!?!?!?!??!?!?!??!?
    fullName: 'Introduction to Computer Science I',
    prereq: [],
    semester: 'Spring',
    shortName: 'CS2400',
  }

  const course2: Course = {
    id: '2',
    college: 'Russ College of Engineering',
    credits: 4,
    description: 'Software tools and techniques for programming.',
    fullName: 'Introduction to Computer Science I',
    prereq: [],
    semester: 'Fall',
    shortName: 'CS3560',
  }

  const springCourses: Course[] = [course, course, course, course]
  const fallCourses: Course[] = [course2, course2, course2, course2]

  // const userCourses = user?.courses.map((course) => {
  //   return (
  //     <Year title='' fallCourses={} springCourses={}></Year>
  //   )
  // })

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <View style={styles.userContainer}>
            <Text style={styles.username}>{'Zachary Wolfe'}</Text>
            <Text style={styles.major}>{user?.major}</Text>
          </View>
          <Image
            style={styles.userImage}
            source={{ uri: user?.photoURL ??
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'}}
            alt='user profile picture'
          />
        </View>
        <ScrollView contentContainerStyle={{ gap: 20}}>
          <Year title='Freshman' fallCourses={fallCourses} springCourses={springCourses}></Year>
          <Year title='Sophomore' fallCourses={fallCourses} springCourses={springCourses}></Year>
          <Year title='Junior' fallCourses={fallCourses} springCourses={springCourses}></Year>
          <Year title='Senior' fallCourses={fallCourses} springCourses={springCourses}></Year>
        </ScrollView>
        {/* <Button onPress={() => dispatch(signOutUser())} color="#039942">
        Logout
      </Button> */}
      </View>
    </SafeAreaView>
  )
}

export default MainPage
