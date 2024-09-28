import { View, Text, Pressable, ScrollView } from 'react-native'
import Divider from '@components/Divider'
import { CourseBrief } from 'src/reducers/courses'
import { useAppSelector } from '@hooks/store'
import { styles } from './styles'
import { useState } from 'react'
import InfoModal from '../../InfoModal'

/**
 * @brief A year component that displays one of the (four)?
 *         or more years of a student's college career
 * @param param0 title: the title of the year the student is on
 * @param param1 fallCourses: an array of courses the student is taking in the fall
 * @param param2 springCourses: an array of courses the student is taking in the spring
 * @returns React.JSX.Element
 */

export default () => {
  const [infoOpen, setInfoOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseBrief>()

  const years = new Map<number, string>()
  years.set(1, 'Freshman')
  years.set(2, 'Sophomore')
  years.set(3, 'Junior')
  years.set(4, 'Senior')

  const userCourses = useAppSelector((state) => state.courses.courses)
  const major = useAppSelector((state) => state.majors.currentMajor)

  const onBriefPress = (brief: CourseBrief) => () => {
    setSelectedCourse(brief)
    setInfoOpen(true)
  }

  const viewSemesters = []

  for (let i = 1; i < (major?.planned_length ?? 8) + 1; i++) {
    const list: CourseBrief[] =
      userCourses?.filter((course) => course.semester === i) ?? []
    list.sort((a, b) => a.shortName.length - b.shortName.length)
    viewSemesters.push(
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        {list?.map((course, index) => {
          return (
            <Pressable
              onPress={onBriefPress(course)}
              key={index}
              style={styles.classContainer}
            >
              <Text style={styles.semesterInnerText}>{course.shortName}</Text>
              <Text style={styles.semesterInnerTextCredits}>
                {course.credits}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    )
  }

  const cards = []

  for (let i = 0; i < viewSemesters.length; i++) {
    // + 1 for Fall because the semester is 1 base-indexed and not 0
    // + 2 for Spring because the semester is 1 base-indexed and not 0
    const totalCreditsFall = userCourses
      ?.filter((course) => course.semester === i + 1)
      .reduce((acc, course) => acc + course.credits, 0)
    const totalCreditsSpring = userCourses
      ?.filter((course) => course.semester === i + 2)
      .reduce((acc, course) => acc + course.credits, 0)

    if (i % 2 === 0) {
      cards.push(
        <View
          key={i}
          style={{
            flexDirection: 'column',
            overflow: 'scroll',
            gap: 5,
            marginHorizontal: 20,
          }}
        >
          <Text style={styles.title}>
            {years.has(i / 2 + 1)
              ? years.get(i / 2 + 1)
              : 'Year ' + (i / 2 + 1)}
          </Text>
          <View style={styles.classesContainer}>
            <View style={styles.semesterContainer}>
              {viewSemesters[i]}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                  }}
                >
                  <Text style={styles.creditsText}>{'Credits: '}</Text>
                  <Text style={styles.creditsValue}>{totalCreditsFall}</Text>
                </View>
                <Text style={styles.semesterTakenText}>Fall</Text>
              </View>
            </View>
            <View style={{ alignContent: 'center' }}>
              <Divider orientation="vertical" width={3} color="#ffffff" />
            </View>
            <View style={styles.semesterContainer}>
              {viewSemesters[i + 1]}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <Text style={styles.semesterTakenText}>Spring</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                  }}
                >
                  <Text style={styles.creditsText}>{'Credits: '}</Text>
                  <Text style={styles.creditsValue}>{totalCreditsSpring}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )
    }
  }

  return (
    <>
      {cards}
      <InfoModal
        visible={infoOpen}
        brief={selectedCourse}
        setVisible={setInfoOpen}
      />
    </>
  )
}
