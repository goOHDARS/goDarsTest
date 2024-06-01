import { View, Text, StyleSheet, Pressable } from 'react-native'
import { CourseBrief } from 'src/reducers/courses'

export default ({ selectedCourses }: { selectedCourses: CourseBrief[] }) => {
  const viewCourses = []
  selectedCourses.length === 0
    ? viewCourses.push(
      <Text>Add a course to your clipboard to get started.</Text>,
    )
    : viewCourses.push(
      selectedCourses?.map((course, index) => {
        // removing pressable here breaks the ScrollView on the Onboarding screen
        return (
          <Pressable key={course.id} style={styles.selectedCourse}>
            <Text style={styles.selectedCourseNameText}>
              {course.shortName}
            </Text>
            <Text style={styles.selectedCourseExtraText}>
              {course.credits}
            </Text>
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
