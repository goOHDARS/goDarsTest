import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import { XCircle } from 'react-native-feather'
import { CourseBrief } from 'src/reducers/courses'

export default ({
  credits,
  setCredits,
  selectedCourses,
  setSelectedCourses,
}: {
  credits: number
  setCredits: React.Dispatch<React.SetStateAction<number>>
  selectedCourses: CourseBrief[]
  setSelectedCourses: React.Dispatch<React.SetStateAction<CourseBrief[]>>
}) => {
  const handlePressX = (courseParam: CourseBrief) => {
    setSelectedCourses(
      selectedCourses.filter(
        (courseFilter) => courseFilter.shortName !== courseParam.shortName
      )
    )
    setCredits(credits - courseParam.credits)
  }
  const viewCourses = []

  viewCourses.push(
    selectedCourses?.map((course, index) => {
      // removing pressable here breaks the ScrollView on the Onboarding screen
      return (
        <Pressable key={index} style={styles.selectedCourse}>
          <Text style={styles.editCourseTextLeft}>{course.shortName}</Text>
          <Text style={styles.editCourseText}>{course.semester}</Text>
          <View
            style={{
              width: '30%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 10,
            }}
          >
            <Text style={styles.selectedCourseExtraText}>{course.credits}</Text>
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => handlePressX(course)}
            >
              <XCircle color={'black'} width={20}></XCircle>
            </TouchableOpacity>
          </View>
        </Pressable>
        // <View style={{ display: 'flex', flexDirection: 'row',
        //   marginBottom: '2.5%', marginTop: '2.5%',
        //   justifyContent: 'space-between', width: '75%'}}>
        //   <Text style={styles.editCourseTextLeft}>Course Name</Text>
        //   <Text style={styles.editCourseText}>Semester</Text>
        //   <Text style={styles.editCourseTextRight}>Credits</Text>
        // </View>
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
    width: '75%',
    alignItems: 'center',
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
  editCourseTextLeft: {
    fontSize: 14,
    fontWeight: '200',
    width: '30%',
    textAlign: 'left',
  },
  editCourseTextRight: {
    fontSize: 12,
    width: '30%',
    textAlign: 'right',
  },
})
