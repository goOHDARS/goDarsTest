import { HelpCircle, Info } from 'react-native-feather'
import { Text, View, ScrollView, Pressable, Modal, TextInput, Alert } from 'react-native'
import ScreenLayout from '@components/ScreenLayout'
import { Course, CourseBrief, UserCourse } from 'src/reducers/courses'
import styles from './styles'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { GET_COURSES_SUCCESS, getCourseInfo, setInitialCourses } from '@actions/courses'
import { getCurrentUser } from '@actions/user'
import Button from '@components/Button'

export default (
  {modalVisible, setModalVisible, selectedCourses, setSelectedCourses, loading}
  :
  {modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  selectedCourses: CourseBrief[], setSelectedCourses: React.Dispatch<React.SetStateAction<CourseBrief[]>>, loading: boolean
   }) => {
  const dispatch = useAppDispatch()
  const course = useAppSelector((state) => state.courses.selectedCourse)
  const user = useAppSelector((state) => state.user.user)

  const handleFinalFinishAccount = async () => {
    const omitArr: Omit<UserCourse, 'id'>[] = selectedCourses.map((course) => {
      return {
        course: course.shortName,
        semester: course.semester ?? 0,
        category: course.category ?? '',
        subcategory: course.subcategory,
      }
    })

    // There were some promise resolution issues with the following two lines
    await dispatch(setInitialCourses(omitArr))
    await dispatch(getCurrentUser())
    dispatch({
      type: GET_COURSES_SUCCESS,
      payload: selectedCourses,
    })
  }

  const checkSemesterPrereq = (course: Course | undefined, newSemester: number) => {
    if (!course) {
      return
    }
    course.prereq.forEach((prereq) => {
      const prereqCourse = selectedCourses.find(
        (course) => {
          return course.shortName === prereq
        }
      )
      if (prereqCourse && prereqCourse.semester && prereqCourse.semester >= newSemester) {
        return false
      }
    })

    return true
  }

  const handleUpdateCourses = (changedCourse: CourseBrief, newSemester: number) => {
    const updatedCourses = selectedCourses.map((tempCourse) => {
      if (tempCourse.shortName === changedCourse.shortName) {
        return { ...tempCourse, semester: newSemester }
      }
      return tempCourse
    })
    setSelectedCourses(updatedCourses)
  }

  const handleEditSemester = (
    changedCourse: CourseBrief,
    newSemester: string
  ) => {
    dispatch(getCourseInfo(changedCourse.shortName))

    if (!changedCourse) {
      return
    }

    if (!(+newSemester > 0 || newSemester === '')) {
      return
    }

    // if (!checkSemesterPrereq(course, +newSemester)) {
    //   Alert.alert('goOHDARS', 'Cannot change the semester of ' + changedCourse.shortName + ' to ' + newSemester + ' because it is lower than the semester of a prerequisite course.', [
    //     {
    //       text: 'Cancel',
    //       style: 'destructive',
    //     },
    //   ])
    // }

    if (user?.semester && user.semester >= +newSemester) {
      handleUpdateCourses(changedCourse, +newSemester)
    } else {
      Alert.alert('goOHDARS', 'Cannot change the semester of ' + changedCourse.shortName + ' to ' + newSemester + ' because it is higher than your current semester, ' + user?.semester + '.', [
        {
          text: 'Cancel',
          style: 'destructive',
        },
      ])
      handleUpdateCourses(changedCourse, 0)
    }
  }

  const handleContinuePress = () => {
    Alert.alert(
      'goOHDARS',
      'Please confirm your edits to your courses. ' +
          'This may impact future suggestions by goOHDARS.',
      [
        {
          text: 'Cancel',
          style: 'destructive',
        },
        {
          text: 'Confirm',
          onPress: () => {
            handleFinalFinishAccount()
          },
          style: 'default',
        },
      ]
    )
  }

  // was re-rendering every time the query was changed
  if (!modalVisible) {
    return null
  }

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      presentationStyle="pageSheet"
    >
      <ScreenLayout style={{ justifyContent: 'flex-start'}}>
        <View style={{ width: '10%', height: 3, backgroundColor: 'gray', marginTop: 5, borderRadius: 100}}>
        </View>
        <View
          style={{
            display: 'flex',
            width: '100%',
            height: '80%',
            alignItems: 'center',
            marginBottom: '10%',
          }}
        >
          <View
            style={{
              display: 'flex',
              marginVertical: '10%',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 28, color: '#039942', fontWeight: '900' }}
            >
                goOHDARS Overview
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
                width: '90%',
                marginVertical: '5%',
              }}
            >
              <Info color={'black'} width={15}></Info>
              <Text style={{ fontSize: 11 }}>
                {'Below are the suggested semesters for each course given by the University Major,' +
                    ' ensure the semester is correct. Edit the course if it doesn\'t match when you took it.'}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: '2.5%',
              marginTop: '2.5%',
              width: '75%',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.editCourseTextLeft}>Course Name</Text>
            <Text style={styles.editCourseText}>Semester</Text>
            <Text style={styles.editCourseTextRight}>Credits</Text>
          </View>
          <ScrollView style={{ width: '75%' }}>
            {selectedCourses.map((course, index) => {
              return (
                <Pressable
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                  key={index}
                >
                  <Text style={styles.editCourseTextLeft}>
                    {course.shortName}
                  </Text>
                  <TextInput
                    value={
                      course?.semester?.toString() === '0'
                        ? ''
                        : course.semester?.toString()
                    }
                    onChangeText={(e) => {
                      handleEditSemester(course, e)
                    }}
                    placeholder="edit me"
                    placeholderTextColor={'lightgray'}
                    style={styles.editCourseText}
                    inputMode="decimal"
                  />
                  <Text style={styles.editCourseTextRight}>
                    {course.credits}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
        <View
          style={{
            display: 'flex',
            width: '90%',
            height: '10%',
            alignContent: 'flex-end',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpCircle strokeWidth={3}></HelpCircle>
            <Text style={{ fontSize: 12, marginLeft: 5 }}>
                This allows goOHDARS to plan future schedules
            </Text>
          </View>
          <Button
            disabled={
              selectedCourses.filter(
                (course) => {
                  return course.semester?.toString() === '' ||
                    course.semester === 0 ||
                    !course.semester
                }
              ).length > 0
            }
            fullWidth
            onPress={handleContinuePress}
            loading={loading}
          >
              Finish Account
          </Button>
        </View>
      </ScreenLayout>
    </Modal>
  )
}
