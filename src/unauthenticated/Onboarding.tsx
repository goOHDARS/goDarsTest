import { GET_COURSES_SUCCESS, getInitialCourses, setInitialCourses } from '@actions/courses'
import { getCurrentUser, SET_USER_SUCCESS } from '@actions/user'
import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import SelectedCourses from '@components/SelectedCourses'
import UserYears from '@components/Semester'
import Snackbar from '@components/Snackbar'
import {
  useAppDispatch,
  useAppSelector,
} from '@hooks/store'
import { original } from '@reduxjs/toolkit'
import { select } from 'firebase-functions/params'
import { updateCurrentUser } from 'firebase/auth'
import {
  useEffect,
  useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native'
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown'
import { Search } from 'react-native-feather'
import { CourseBrief, UserCourse } from 'src/reducers/courses'

export default () => {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user?.user)
  const courses = useAppSelector((state) => state.courses.courses)
  const major = useAppSelector((state) => state.majors.currentMajor)

  const [added, setAdded] = useState<CourseBrief>()
  const [isVisible, setIsVisible] = useState(false)

  const [credits, setCredits] = useState(0.0)
  const [selectedCourses, setSelectedCourses] = useState<CourseBrief[]>([])
  const originalDataSet = courses !== undefined && Array.isArray(courses) ?
    courses.map((course, index) => {
      return {
        id: course.id,
        title: course.shortName,
      }
    }) : []

  const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>(originalDataSet)

  const handleSelectCourse = (courseParam: TAutocompleteDropdownItem) => {
    if (!courseParam || !courseParam.title) return

    const selectedCourse = courses?.find(
      (course) => course.shortName === courseParam.title,
    )

    if (
      selectedCourse &&
      !selectedCourses.includes(
        selectedCourses.filter(
          (course) => course.shortName === selectedCourse.shortName,
        )[0],
      )
    ) {
      setSelectedCourses([...selectedCourses, selectedCourse])
      setAdded(selectedCourse)
      setCredits(credits + selectedCourse.credits)
      setIsVisible(true)
    } else if (selectedCourse) {
      setSelectedCourses(
        selectedCourses.filter(
          (course) => course.shortName !== selectedCourse.shortName,
        ),
      )
    }
  }

  const handleUndoCourse = (courseParam: CourseBrief | undefined) => {
    if (courseParam) {
      setSelectedCourses(
        selectedCourses?.filter(
          (course) => course.shortName !== courseParam.shortName,
        ),
      )
      setCredits(credits - courseParam?.credits)
    }
  }

  const handleContinuePress = async () => {
    const omitArr: Omit<UserCourse, 'id'>[] = selectedCourses.map((course) => {
      return {
        course: course.shortName,
        semester: course.semester,
        category: course.category,
        subcategory: course.subcategory,
      }
    })
    await dispatch(setInitialCourses(omitArr))
    dispatch(getCurrentUser())
    dispatch({
      type: GET_COURSES_SUCCESS,
      payload: {
        courses: selectedCourses,
      },
    })
  }

  const handleClearPress = () => {
    setSelectedCourses([])
    setDataSet(originalDataSet)
    setCredits(0.0)
  }

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [isVisible])

  useEffect(() => {
    console.log('\n\nCOURSESFILTER: ')
    console.log(courses)
    console.log('\n\n')
    if (added && courses) {
      const except = courses?.filter((course) => !selectedCourses.some(
        (selectedCourses) => selectedCourses.shortName === course.shortName))

      if (except) {
        setDataSet(except?.map((course, index) => {
          return {
            key: index,
            id: course.id,
            title: course.shortName,
          }
        }))
      }
    }

    if (!courses || courses.length === 0) {
      dispatch(getInitialCourses())
    }

    if ((!dataSet || dataSet.length === 0) && courses?.length !== 0) {
      setDataSet(originalDataSet)
    }
  }, [added, courses, selectedCourses])

  return (
    <ScreenLayout style={{ justifyContent: 'space-between' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Snackbar
          message={'Added ' + added?.shortName + ' to clipboard'}
          visible={isVisible}
          actionText="UNDO"
          onActionPress={() => {
            handleUndoCourse(added)
          }}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.title}>goOHDARS</Text>
          <Text style={styles.title2}>Courses taken</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <View style={styles.textBox}>
            <View style={styles.disabledInputTextContainer}>
              <Search color={'#ffffff'} strokeWidth={3}></Search>
            </View>
            <AutocompleteDropdown
              containerStyle={styles.textBoxInput}
              textInputProps={{
                style: styles.dropDownText,
                placeholder: 'Search for a course...',
                placeholderTextColor: '#000000',
              }}
              inputContainerStyle={styles.dropDownInput}
              rightButtonsContainerStyle={{ height: 50 }}
              onSelectItem={(course) => {
                handleSelectCourse(course)
              }}
              showClear={false}
              clearOnFocus={true}
              closeOnBlur={true}
              useFilter={true}
              suggestionsListMaxHeight={500}
              closeOnSubmit={false}
              dataSet={dataSet}
              direction={Platform.select({ ios: 'down' })}
              emptyResultText="No course found with that name."
              suggestionsListContainerStyle={{
                height: 275,
                width: '110%',
                backgroundColor: 'white',
                justifyContent: 'center',
                borderRadius: 10,
                right: 37,
              }}
            />
          </View>
        </View>
        <View style={styles.clipboardContainer}>
          <Text style={styles.clipboard}>Clipboard</Text>
          <View style={styles.divider}></View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 5, width: '100%' }}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        <SelectedCourses selectedCourses={selectedCourses}></SelectedCourses>
      </ScrollView>
      <View style={{ display: 'flex', flexDirection: 'row',
        width: '75%', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: '700' }}>
          {credits === 0 ? '' : 'Selected Credits '}
        </Text>
        <Text style={{ fontWeight: '700' }}>
          {credits === 0 ? '' : credits.toFixed(2)}
        </Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row',
        width: '75%', justifyContent: 'space-between'}}>
        <Text style={{ fontWeight: '700' }}>
          {'Required Credits to Graduate '}
        </Text>
        <Text style={{ fontWeight: '700' }}>
          {major?.credits_required ? major?.credits_required.toFixed(2) : '0.0'}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'flex-end',
          width: '90%',
          marginBottom: 30,
          gap: 10,
        }}
      >
        <Button
          disabled={selectedCourses.length === 0}
          fullWidth
          onPress={handleClearPress}
        >
          Clear
        </Button>
        <Button
          disabled={selectedCourses.length === 0}
          fullWidth
          onPress={handleContinuePress}
        >
          Finish Account
        </Button>
      </View>
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 50,
    fontWeight: '900',
    color: '#039942',
  },
  title2: {
    fontSize: 30,
    fontWeight: '900',
    color: '#039942',
  },
  textBoxInput: {
    display: 'flex',
    fontSize: 20,
    height: 50,
    width: '90%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  textBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    borderWidth: 1,
    borderColor: '#039942',
    borderRadius: 10,
    height: 50,
  },
  disabledInputTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#039942',
    height: 50,
    width: 40,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  icon: {
    color: '#ffffff',
  },
  dropDownText: {
    fontSize: 20,
    height: 50,
  },
  dropDownInput: {
    borderRadius: 10,
    backgroundColor: '#ffffff00',
    width: '100%',
  },
  clipboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
  },
  clipboard: {
    display: 'flex',
    fontSize: 24,
    textAlign: 'left',
    fontWeight: '200',
    textTransform: 'uppercase',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
})
