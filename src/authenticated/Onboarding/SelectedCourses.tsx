import { useAppSelector } from '@hooks/store'
import { View, Text, StyleSheet, Pressable, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native'
import { XCircle } from 'react-native-feather'
import { CourseBrief } from 'src/reducers/courses'

export default (
  { credits, setCredits, selectedCourses, setSelectedCourses, setEditing }
  :
  { credits: number, 
    setCredits: React.Dispatch<React.SetStateAction<number>>,
    selectedCourses: CourseBrief[],
    setSelectedCourses: React.Dispatch<React.SetStateAction<CourseBrief[]>>,
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  }) => {

  const user = useAppSelector((state) => state.user.user)
  const handlePressX = (courseParam: CourseBrief) => {
    setSelectedCourses(
      selectedCourses.filter(
        (courseFilter) => courseFilter.shortName !== courseParam.shortName
      )
    )
    setCredits(credits - courseParam.credits)
  }
  const viewCourses = []

  const handleEditSemester = (changedCourse: CourseBrief, newSemester: string) => {
    if (+newSemester > 0 || newSemester === '') {
      if (user?.semester && user?.semester >= +newSemester) {
        const updatedCourses = selectedCourses.map((course) => {
          if (course.shortName === changedCourse.shortName) {
            return { ...course, semester: +newSemester }
          }
          return course
        })
        setSelectedCourses(updatedCourses)
      } else {
        Alert.alert('goOHDARS', 'Cannot set semester higher than current semester.', [
          {
            text: 'Cancel',
            style: 'destructive',
          },
        ])
        const updatedCourses = selectedCourses.map((course) => {
          if (course.shortName === changedCourse.shortName) {
            return { ...course, semester: 0 } // Create a new object with updated semester
          }
          return course
        })
        setSelectedCourses(updatedCourses)
      }
    }
  }

  viewCourses.push(
    selectedCourses?.map((course, index) => {
      // removing pressable here breaks the ScrollView on the Onboarding screen
      return (
        <Pressable key={index} style={styles.selectedCourse}>
          <View style={styles.editCourseTextContainer}>
            <Text style={styles.editCourseTextLeft}>{course.shortName}</Text>
            <ScrollView horizontal={true}><Pressable style={{ marginBottom: 10}}><Text style={{ fontSize: 10 }}>{course.fullName}</Text></Pressable></ScrollView>
          </View>
          <TextInput
            value={course?.semester?.toString() === '0' ? '' :
              course.semester?.toString()}
            onChangeText={(e) => {
              handleEditSemester(course, e)
            }}
            placeholder='edit me'
            style={styles.editCourseText}
            onFocus={() => {
              setEditing(true)
            }}
            inputMode='decimal'
          />
          <View style={{ width: '30%', display: 'flex', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <Text style={styles.selectedCourseExtraText}>
              {course.credits}
            </Text>
            <TouchableOpacity style={{marginRight: 10}} onPress={() => handlePressX(course)}>
              <XCircle color={'black'} width={20}></XCircle>
            </TouchableOpacity>
          </View>
        </Pressable>
      )
    })
  )

  return viewCourses
}

const styles = StyleSheet.create({
  selectedCourse: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  selectedCourseExtraText: {
    fontSize: 12,
    fontWeight: '400',
  },
  editCourseText: {
    fontSize: 12,
    width: '30%',
    textAlign: 'center',
  },
  editCourseTextAlt: {
    color: '#BBBBBB',
    fontSize: 12,
    width: '30%',
    textAlign: 'center',
  },
  editCourseTextContainer: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'left',
    maxWidth: '30%',
  },
  editCourseTextLeft: {
    fontSize: 14,
    fontWeight: '200',
  },
  editCourseTextRight: {
    fontSize: 12,
    width: '30%',
    textAlign: 'right',
  },
})
