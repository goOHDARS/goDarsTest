import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import { XCircle } from 'react-native-feather'
import { CourseBrief } from 'src/reducers/courses'

export default (
  { credits, setCredits, selectedCourses, setSelectedCourses }
  :
  { credits: number, setCredits: React.Dispatch<React.SetStateAction<number>>,
    selectedCourses: CourseBrief[],
    setSelectedCourses: React.Dispatch<React.SetStateAction<CourseBrief[]>>
  }) => {
  const viewCourses = []
  selectedCourses.length === 0
    ? viewCourses.push(
      <Text key={Math.random()}>Add a course to your clipboard to get started.</Text>,
    )
    : viewCourses.push(
      selectedCourses?.map((course, index) => {
        // removing pressable here breaks the ScrollView on the Onboarding screen
        return (
          <Pressable key={index} style={styles.selectedCourse}>
            <Text style={styles.selectedCourseNameText}>
              {course.shortName}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Text style={styles.selectedCourseExtraText}>
                {course.credits}
              </Text>
              <TouchableOpacity onPress={() => {
                setSelectedCourses(selectedCourses.filter((courseFilter) =>
                  courseFilter.shortName !== course.shortName)),
                setCredits(credits - course.credits)
              }}>
                <XCircle color={'black'} width={20}></XCircle>
              </TouchableOpacity>
            </View>
          </Pressable>
        )
      }),
    )

  return viewCourses
}

const styles = StyleSheet.create({
  selectedCourse: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
  },
  selectedCourseNameText: {
    fontSize: 14,
    fontWeight: '200',
    textTransform: 'uppercase',
  },
  selectedCourseExtraText: {
    fontSize: 12,
    fontWeight: '400',
  },
})
