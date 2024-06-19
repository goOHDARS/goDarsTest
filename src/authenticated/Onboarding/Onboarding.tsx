import {
  GET_COURSES_SUCCESS,
  getInitialCourses,
  QUERY_COURSES_SUCCESS,
  queryCourses,
  setInitialCourses,
} from '@actions/courses'
import { getCurrentUser, SET_USER_SUCCESS } from '@actions/user'
import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import SelectedCourses from '@components/SelectedCourses'
import Snackbar from '@components/Snackbar'
import {
  useAppDispatch,
  useAppSelector,
} from '@hooks/store'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  View,
  Text,
  ScrollView,
  Platform,
  Alert,
  Animated,
} from 'react-native'
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown'
import {
  Info,
  Search,
} from 'react-native-feather'
import {
  CourseBrief,
  UserCourse,
} from 'src/reducers/courses'
import _ from 'lodash'
import { styles } from './styles'

export default () => {
  const dispatch = useAppDispatch()

  const initialCourses = useAppSelector((state) => state.courses.courses)
  const user = useAppSelector((state) => state.user.user)
  const courses = useAppSelector((state) => state.courses.queryResults)
  const major = useAppSelector((state) => state.majors.currentMajor)
  const loading = useAppSelector((state) => state.user.loading)

  const [editing, setEditing] = useState(false)
  const [typing, setTyping] = useState(false)

  const [added, setAdded] = useState<CourseBrief>()
  const [isVisible, setIsVisible] = useState(false)

  const [credits, setCredits] = useState(0.0)
  const [selectedCourses, setSelectedCourses] = useState<CourseBrief[]>([])

  const [infoVisible, setInfoVisible] = useState(true)

  const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>([])
  const [query, setQuery] = useState('')

  const [initialized, setInitialized] = useState(false)

  const scrollViewRef = useRef<ScrollView>(null)

  const translation = useRef(new Animated.Value(0)).current

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
        )
      )
    }
  }

  const handleUndoCourse = (courseParam: CourseBrief | undefined) => {
    if (courseParam) {
      setSelectedCourses(
        selectedCourses?.filter(
          (course) => course.shortName !== courseParam.shortName,
        ).sort()
      )
      setCredits(credits - courseParam?.credits)
    }
  }

  const debouncedQuery = _.debounce((query: string) => {
    dispatch(queryCourses(query))
  }, 600)

  const handleSetQuery = (e: string) => {
    setQuery(e)
    setTyping(true)
    if (e.length >= 3) {
      debouncedQuery(query)
      return
    } else if (e.length < 3) {
      dispatch({
        type: QUERY_COURSES_SUCCESS,
        payload: [],
      })
    }
  }

  const handleContinuePress = () => {
    Alert.alert('goOHDARS', 'Please confirm your edits to your courses. ' +
    'This may impact future suggestions by goOHDARS.', [
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
    ])
  }
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
    dispatch({
      type: GET_COURSES_SUCCESS,
      payload: selectedCourses,
    })
    dispatch({
      type: SET_USER_SUCCESS,
      payload: {
        ...user,
        credits: selectedCourses.reduce((acc, course) => acc + course.credits, 0),
      },
    })
    await dispatch(getCurrentUser())
  }

  useEffect(() => {
    if (added && courses) {
      if (infoVisible) {
        setInfoVisible(false)
      }

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
    if (isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false)
      }, 2500)

      return () => clearTimeout(timeout)
    }
    if (courses !== undefined) {
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
    if (editing) {
      Animated.timing(translation, {
        toValue: -50,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(translation, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, added, courses, editing])

  useEffect(() => {
    if (initialCourses === null || initialCourses === undefined
      || initialCourses.length === 0 || !Array.isArray(initialCourses)) {
      dispatch(getInitialCourses())
    } else if (initialCourses && !initialized) {
      setSelectedCourses(initialCourses)
      setCredits(initialCourses.reduce((acc, course) => acc + course.credits, 0))
      setInitialized(true)
    }
  })

  return (
    <ScreenLayout style={{ justifyContent: 'space-between' }} onDismissFunc={() => {
      editing ? setEditing(false) : undefined
    }}>
      <Animated.View
        style={{
          transform: [
            {translateY: translation},
            {perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
          ],
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          gap: 10,
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
              onChangeText={(e) => handleSetQuery(e)}
              onFocus={() => {
                editing ? setEditing(false) : null
              }}
              containerStyle={styles.textBoxInput}
              textInputProps={{
                style: styles.dropDownText,
                placeholder: 'CS4040...',
                placeholderTextColor: '#BBBBBB',
              }}
              inputContainerStyle={styles.dropDownInput}
              rightButtonsContainerStyle={{ height: 50 }}
              onSelectItem={(course) => {
                handleSelectCourse(course),
                setTyping(false),
                setEditing(false)
              }}
              showClear={false}
              clearOnFocus={true}
              closeOnBlur={true}
              useFilter={true}
              suggestionsListMaxHeight={500}
              closeOnSubmit={false}
              dataSet={dataSet}
              direction={Platform.select({ ios: 'down' })}
              emptyResultText="No course found with that name or course already in list."
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
        {infoVisible ?
          <View style={{ display: 'flex', flexDirection: 'row', width: '90%', gap: 5}}>
            <Info color={'black'} width={15}></Info>
            <Text style={{ fontSize: 11 }}>
              {'Below are suggested semesters for these courses,' +
            ' edit the semester if the course was taken at a different time.' +
            ' Scroll to view the whole name of the course in the Clipboard.'}
            </Text>
          </View>
          : null}
        <View style={styles.clipboardContainer}>
          <Text style={styles.clipboard}>Clipboard</Text>
          <View style={styles.divider}></View>
        </View>
      </Animated.View>
      <Animated.View style={{ transform: [
        {translateY: translation},
        {perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
      ], display: 'flex', flexDirection: 'row',
      justifyContent: 'space-between', width: '75%', marginBottom: '2.5%'}}>
        <Text style={styles.editCourseTextLeft}>Course Name</Text>
        <Text style={styles.editCourseText}>Semester</Text>
        <Text style={styles.editCourseText}>Credits</Text>
      </Animated.View>
      <Animated.ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{ gap: 5, width: '75%' }}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        scrollToOverflowEnabled={editing ? false : true}
        style={{transform: [
          {translateY: translation},
          {perspective: 1000}, // without this line this Animation will not render on Android while working fine on iOS
        ],
        marginBottom: '2.5%',
        }}
      >
        <SelectedCourses
          courses={courses ?? []}
          dataSet={dataSet} setDataSet={setDataSet}
          credits={credits} setCredits={setCredits}
          selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses}
          setEditing={setEditing}
          scrollRef={scrollViewRef}>
        </SelectedCourses>
      </Animated.ScrollView>
      <View style={{ display: 'flex', flexDirection: 'row',
        width: '75%', justifyContent: 'space-between',
        marginTop: 10}}>
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
          marginTop: 10,
          gap: 10,
        }}
      >
        <Button
          disabled={selectedCourses.filter((course) =>
            course.semester?.toString() === '' || course.semester === 0
            || course.semester === null || course.semester === undefined).length > 0}
          fullWidth
          onPress={handleContinuePress}
          loading={loading}
        >
          Finish Account
        </Button>
      </View>
    </ScreenLayout>
  )
}
