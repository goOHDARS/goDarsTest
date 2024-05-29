import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native'
import React, { useEffect } from 'react'
import Divider from '@components/Divider'
import { CourseBrief } from 'src/reducers/courses'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { getCurrentMajor } from '@actions/majors'

/**
 * @brief A year component that displays one of the (four)?
 *         or more years of a student's college career
 * @param param0 title: the title of the year the student is on
 * @param param1 fallCourses: an array of courses the student is taking in the fall
 * @param param2 springCourses: an array of courses the student is taking in the spring
 * @returns React.JSX.Element
 */

const UserYears = () => {
  const years = new Map<number, string>()
  years.set(1, 'Freshman')
  years.set(2, 'Sophomore')
  years.set(3, 'Junior')
  years.set(4, 'Senior')

  const user = useAppSelector((state) => state.user?.user)
  const userCourses = useAppSelector((state) => state.courses?.courses)
  const major = useAppSelector((state) => state.majors.currentMajor)
  const dispatch = useAppDispatch()

  useEffect(() =>{
    dispatch(getCurrentMajor())
  }, [])

  const viewSemesters = []

  for (let i = 1; i < (major?.planned_length ?? 8) + 1; i++) {
    const bool = i % 2 === 1
    const list = userCourses?.filter((course) => course.semester === i)
    viewSemesters.push(
      <Pressable style={(bool) ? styles.fallSemesterContainer : styles.springSemesterContainer}>
        <View style={(bool) ? styles.fallSemester : styles.springSemester}>
          {list?.map((course, index) => {
            return (
              <View style={styles.classContainer} key={index}>
                <Text style={styles.semesterInnerText}>{course.shortName}</Text>
                <Text style={styles.semesterInnerText}>{course.credits}</Text>
              </View>
            )
          })}
        </View>

        <Text style={(bool) ? styles.fallSemesterText : styles.springSemesterText}>
          {(bool) ? 'Fall' : 'Spring'}
        </Text>

      </Pressable>
    )
  }

  const viewYears = []

  for (let i = 0; i < viewSemesters.length; i++) {
    if (i % 2 === 0) {
      viewYears.push(
        <View style={{ flexDirection: 'column', overflow: 'scroll'}}>
          <Text style={styles.title}>
            {(years.has(i/2 + 1) ? years.get(i/2 + 1) : 'Year ' + (i/2 + 1))}
          </Text>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            {viewSemesters[i]}
            <View style= {{alignContent: 'center'}}>
              <Divider orientation="vertical" width={3} color="#ffffff"/>
            </View>
            {viewSemesters[i+1]}
          </View>
        </View>
      )
    }
  }

  return viewYears
}

export default UserYears


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
