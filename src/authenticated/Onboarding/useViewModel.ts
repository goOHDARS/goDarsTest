import {
  getInitialCourses,
  queryCourses,
  setInitialCourses,
  resetQueryCourses,
  GET_COURSES_SUCCESS,
} from '@actions/courses'
import { getCurrentUser, SET_USER_SUCCESS } from '@actions/user'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Animated, ScrollView } from 'react-native'
import {
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown'
import { CourseBrief, UserCourse } from 'src/reducers/courses'

const useViewModel = () => {
  const dispatch = useAppDispatch()
  const initialCourses = useAppSelector((state) => state.courses.courses)
  const user = useAppSelector((state) => state.user.user)
  const queriedCourses = useAppSelector((state) => state.courses.queryResults)
  const coursesLoading = useAppSelector((state) => state.courses.loading)
  const major = useAppSelector((state) => state.majors.currentMajor)
  const userLoading = useAppSelector((state) => state.user.loading)

  const [isVisible, setIsVisible] = useState(false)
  const [credits, setCredits] = useState(0.0)
  const [selectedCourses, setSelectedCourses] = useState<CourseBrief[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [editing, setEditing] = useState(false)
  const [typing, setTyping] = useState(false)
  const [infoVisible, setInfoVisible] = useState(true)

  const scrollViewRef = useRef<ScrollView>(null)

  const translation = useRef(new Animated.Value(0)).current

  const dropdowncontroller = useRef<AutocompleteDropdownRef>()

  const dropdownData = useMemo(
    () =>
      queriedCourses
        ?.filter(
          (course) =>
            !selectedCourses.find(
              (selectedCourse) => selectedCourse.shortName === course.shortName
            )
        )
        .map((course, index) => ({
          key: index,
          id: course.id,
          title: course.shortName,
        })) ?? [],
    [queriedCourses, selectedCourses]
  )

  const handleSelectCourse = (courseParam: TAutocompleteDropdownItem) => {
    if (!courseParam || !courseParam.title) return

    const selectedCourse = queriedCourses?.find(
      (course) => course.shortName === courseParam.title
    )

    if (
      selectedCourse &&
      !selectedCourses.find(
        (course) => course.shortName === selectedCourse.shortName
      )
    ) {
      setSelectedCourses((prev) => [...prev, selectedCourse])
      handleResetQuery()
      dropdowncontroller.current?.clear()
      setCredits(credits + selectedCourse.credits)
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 3000)
    } else if (selectedCourse) {
      setSelectedCourses((prev) =>
        prev.filter((course) => course.shortName !== selectedCourse.shortName)
      )
    }
  }

  const handleUndoCourse = (courseParam?: CourseBrief) => {
    if (courseParam) {
      setSelectedCourses((prev) =>
        prev
          ?.filter((course) => course.shortName !== courseParam.shortName)
          .sort()
      )
      setCredits(credits - courseParam?.credits)
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

  const handleFinalFinishAccount = async () => {
    const omitArr: Omit<UserCourse, 'id'>[] = selectedCourses.map((course) => ({
      course: course.shortName,
      semester: course.semester ?? 0,
      category: course.category ?? '',
      subcategory: course.subcategory,
    }))
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

  const handleSetQuery = (e: string) => {
    if (e.length === 3 && dropdownData.length === 0) {
      dispatch(queryCourses(e))
    } else if (e.length < 3) {
      handleResetQuery()
    }
  }

  const handleEditSemester = (
    changedCourse: CourseBrief,
    newSemester: string
  ) => {
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
        Alert.alert(
          'goOHDARS',
          'Cannot set semester higher than current semester.',
          [
            {
              text: 'Cancel',
              style: 'destructive',
            },
          ]
        )
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

  const handleEditSemesters = () => {
    setModalVisible(true)
  }

  const handleResetQuery = () => {
    dispatch(resetQueryCourses())
  }

  useEffect(() => {
    if (
      !initialCourses ||
      initialCourses.length === 0 ||
      !Array.isArray(initialCourses)
    ) {
      dispatch(getInitialCourses())
    } else if (initialCourses && !initialized) {
      setSelectedCourses(initialCourses)
      setCredits(
        initialCourses.reduce((acc, course) => acc + course.credits, 0)
      )
      setInitialized(true)
    }
  }, [initialCourses])

  useEffect(() => {
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
  }, [editing])

  return {
    initialCourses,
    user,
    queriedCourses,
    isVisible,
    credits,
    selectedCourses,
    modalVisible,
    dropdowncontroller,
    dropdownData,
    coursesLoading,
    userLoading,
    major,
    setCredits,
    setSelectedCourses,
    setModalVisible,
    handleSelectCourse,
    handleUndoCourse,
    handleContinuePress,
    handleFinalFinishAccount,
    handleSetQuery,
    handleEditSemester,
    handleResetQuery,
    setEditing,
    editing,
    typing,
    setTyping,
    translation,
    infoVisible,
    scrollViewRef,
    handleEditSemesters,
  }
}

export default useViewModel
