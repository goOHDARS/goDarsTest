import {
  GET_COURSES_SUCCESS,
  getInitialCourses,
  queryCourses,
  resetQueryCourses,
  setInitialCourses,
} from '@actions/courses'
import { getCurrentUser } from '@actions/user'
import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import SelectedCourses from '@components/SelectedCourses'
import Snackbar from '@components/Snackbar'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native'
import {
  AutocompleteDropdown,
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown'
import { HelpCircle, Info, Search } from 'react-native-feather'
import { CourseBrief, UserCourse } from 'src/reducers/courses'
import _ from 'lodash'

export default () => {
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
      dispatch(resetQueryCourses())
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
    await dispatch(getCurrentUser())
    dispatch({
      type: GET_COURSES_SUCCESS,
      payload: selectedCourses,
    })
  }

  const handleSetQuery = (e: string) => {
    if (e.length === 3 && dropdownData.length === 0) {
      dispatch(queryCourses(e))
    } else if (e.length < 3) {
      dispatch(resetQueryCourses())
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

  return (
    <ScreenLayout style={{ justifyContent: 'space-between' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          gap: 15,
        }}
      >
        <Snackbar
          message={
            'Added ' +
            selectedCourses[selectedCourses.length - 1]?.shortName +
            ' to clipboard'
          }
          visible={isVisible}
          actionText="UNDO"
          onActionPress={() => {
            handleUndoCourse(selectedCourses[selectedCourses.length - 1])
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
              controller={(controller) => {
                dropdowncontroller.current = controller
              }}
              loading={coursesLoading}
              onChangeText={handleSetQuery}
              containerStyle={styles.textBoxInput}
              textInputProps={{
                style: styles.dropDownText,
                placeholder: 'Search for a course...',
                placeholderTextColor: '#000000',
              }}
              inputContainerStyle={styles.dropDownInput}
              rightButtonsContainerStyle={{ height: 50 }}
              onSelectItem={handleSelectCourse}
              showClear={false}
              clearOnFocus={true}
              onFocus={() => dispatch(resetQueryCourses())}
              closeOnBlur={true}
              useFilter={true}
              suggestionsListMaxHeight={500}
              closeOnSubmit={false}
              dataSet={dropdownData}
              direction={Platform.select({ ios: 'down' })}
              emptyResultText="No course found with that name or course already in list."
              suggestionsListContainerStyle={{
                width: '110%',
                backgroundColor: 'white',
                justifyContent: 'center',
                borderRadius: 10,
                right: 37,
              }}
            />
          </View>
        </View>
        <Text style={{ fontSize: 11 }}>
          Please add all courses with their respective semester.
        </Text>
        <View style={styles.clipboardContainer}>
          <Text style={styles.clipboard}>Clipboard</Text>
          <View style={styles.divider}></View>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: '2.5%',
          marginTop: '2.5%',
          justifyContent: 'space-between',
          width: '75%',
        }}
      >
        <Text style={styles.editCourseTextLeft}>Course Name</Text>
        <Text style={styles.editCourseText}>Semester</Text>
        <Text style={styles.editCourseText}>Credits</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ gap: 5, width: '100%' }}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        <SelectedCourses
          credits={credits}
          setCredits={setCredits}
          setSelectedCourses={setSelectedCourses}
          selectedCourses={selectedCourses}
        />
      </ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '75%',
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: '700' }}>
          {credits === 0 ? '' : 'Selected Credits '}
        </Text>
        <Text style={{ fontWeight: '700' }}>
          {credits === 0 ? '' : credits.toFixed(2)}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '75%',
          justifyContent: 'space-between',
        }}
      >
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
          disabled={selectedCourses.length === 0}
          fullWidth
          onPress={() => setModalVisible(true)}
        >
          Edit Semesters
        </Button>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          presentationStyle="pageSheet"
        >
          <ScreenLayout>
            <View
              style={{
                display: 'flex',
                width: '100%',
                height: '90%',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  display: 'flex',
                  marginVertical: '10%',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 28, color: '#039942', fontWeight: '900' }}
                >
                  Adjust your semesters
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10,
                    width: '90%',
                    marginVertical: '5%',
                  }}
                >
                  <Info color={'black'} width={15}></Info>
                  <Text style={{ fontSize: 11 }}>
                    {'Below are suggested semesters for these courses,' +
                      ' edit the semester if the course was taken at a different time'}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: '2.5%',
                  marginTop: '2.5%',
                  width: '75%',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.editCourseTextLeft}>Course Name</Text>
                <Text style={styles.editCourseText}>Semester</Text>
                <Text style={styles.editCourseTextRight}>Credits</Text>
              </View>
              <ScrollView style={{ width: '75%' }}>
                {selectedCourses.map((course, index) => {
                  return (
                    <Pressable
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                      }}
                      key={index}
                    >
                      <Text style={styles.editCourseTextLeft}>
                        {course.shortName}
                      </Text>
                      <TextInput
                        value={
                          course?.semester?.toString() === '0'
                            ? ''
                            : course.semester?.toString()
                        }
                        onChangeText={(e) => {
                          handleEditSemester(course, e)
                        }}
                        placeholder="edit me"
                        style={styles.editCourseText}
                        inputMode="decimal"
                      />
                      <Text style={styles.editCourseTextRight}>
                        {course.credits}
                      </Text>
                    </Pressable>
                  )
                })}
              </ScrollView>
            </View>
            <View
              style={{
                display: 'flex',
                width: '90%',
                height: '10%',
                alignContent: 'flex-end',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HelpCircle strokeWidth={3}></HelpCircle>
                <Text style={{ fontSize: 12, marginLeft: 5 }}>
                  This allows goOHDARS to plan future schedules
                </Text>
              </View>
              <Button
                disabled={
                  selectedCourses.filter(
                    (course) =>
                      course.semester?.toString() === '' ||
                      course.semester === 0
                  ).length > 0
                }
                fullWidth
                onPress={handleContinuePress}
                loading={userLoading}
              >
                Finish Account
              </Button>
            </View>
          </ScreenLayout>
        </Modal>
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
    width: '90%',
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
  editCourseText: {
    fontSize: 12,
    width: '30%',
    textAlign: 'center',
  },
  editCourseTextLeft: {
    fontSize: 12,
    width: '30%',
    textAlign: 'left',
  },
  editCourseTextRight: {
    fontSize: 12,
    width: '30%',
    textAlign: 'right',
  },
})
