import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native'
import React from 'react'
import Divider from '@components/Divider'
import { Course } from 'src/reducers'

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Helvetica Neue',
    fontSize: 26,
    fontWeight: '300',
    paddingBottom: 5,
    paddingLeft: 20,
  },
  springSemester: {
    paddingTop: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    alignContent: 'flex-start',
    gap: 10,
  },
  fallSemester: {
    paddingTop: 20,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 100,
    alignContent: 'flex-start',
    gap: 10,
  },
  springSemesterContainer: {
    backgroundColor: '#024230',
    minWidth: '45%',
    minHeight: 350,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'column',
  },
  fallSemesterContainer: {
    display: 'flex',
    backgroundColor: '#024230',
    minWidth: '45%',
    minHeight: 350,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'column',
    gap: 10,
  },
  fallSemesterText: {
    alignSelf: 'flex-end',
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    maxHeight: '10%',
    marginBottom: 10,
    marginRight: 10,
  },
  springSemesterText: {
    alignSelf: 'flex-start',
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    maxHeight: '10%',
    marginBottom: 10,
    marginLeft: 10,
  },
  semesterInnerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  classContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
})

/**
 * @brief A year component that displays one of the (four)?
 *         or more years of a student's college career
 * @param param0 title: the title of the year the student is on
 * @param param1 fallCourses: an array of courses the student is taking in the fall
 * @param param2 springCourses: an array of courses the student is taking in the spring
 * @returns React.JSX.Element
 */

const Year = (
  {title, fallCourses, springCourses} :
  {title: string, fallCourses: Course[], springCourses: Course[]}
) => {
  const fallSemester = fallCourses.map((course) => {
    return (
      <View style={styles.classContainer} key={course.id}>
        <Text style={styles.semesterInnerText}>{course.shortName}</Text>
        <Text style={styles.semesterInnerText}>{course.credits}</Text>
      </View>
    )
  })

  const springSemester = springCourses.map((course) => {
    return (
      <View style={styles.classContainer} key={course.id}>
        <Text style={styles.semesterInnerText}>{course.shortName}</Text>
        <Text style={styles.semesterInnerText}>{course.credits}</Text>
      </View>
    )
  })

  return (
    <View style={{ flexDirection: 'column', overflow: 'scroll'}}>
      <Text style={styles.title}>
        {title}
      </Text>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
        {/* </View>onPress={() => setSeniorModalFall(true)} */}
        <Pressable style={styles.fallSemesterContainer}>
          <View style={styles.fallSemester}>
            {fallSemester}
          </View>
          <Text style={styles.fallSemesterText}>
                Fall
          </Text>
        </Pressable>
        <View style= {{alignContent: 'center'}}>
          <Divider orientation="vertical" width={3} color="#ffffff"/>
        </View>
        {/* </View>onPress={() => setSeniorModalSpring(true)} */}
        <Pressable style={styles.springSemesterContainer} >
          <View style={styles.springSemester}>
            {springSemester}
          </View>
          <Text style={styles.springSemesterText}>
            Spring
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Year
