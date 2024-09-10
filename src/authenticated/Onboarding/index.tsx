import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import SelectedCourses from './SelectedCourses'
import Snackbar from '@components/Snackbar'
import {
  View,
  Text,
  ScrollView,
  Platform,
  Modal,
  TextInput,
  Pressable,
} from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { HelpCircle, Info, Search } from 'react-native-feather'
import useViewModel from './useViewModel'
import styles from './styles'

type Props = ReturnType<typeof useViewModel>

const OnboardingRoot = (props: Props) => {
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
            props.selectedCourses[props.selectedCourses.length - 1]?.shortName +
            ' to clipboard'
          }
          visible={props.isVisible}
          actionText="UNDO"
          onActionPress={() => {
            props.handleUndoCourse(
              props.selectedCourses[props.selectedCourses.length - 1]
            )
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
                props.dropdowncontroller.current = controller
              }}
              loading={props.coursesLoading}
              onChangeText={props.handleSetQuery}
              containerStyle={styles.textBoxInput}
              textInputProps={{
                style: styles.dropDownText,
                placeholder: 'Search for a course...',
                placeholderTextColor: '#000000',
              }}
              inputContainerStyle={styles.dropDownInput}
              rightButtonsContainerStyle={{ height: 50 }}
              onSelectItem={props.handleSelectCourse}
              showClear={false}
              clearOnFocus={true}
              onFocus={props.handleResetQuery}
              closeOnBlur={true}
              useFilter={true}
              suggestionsListMaxHeight={500}
              closeOnSubmit={false}
              dataSet={props.dropdownData}
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
          credits={props.credits}
          setCredits={props.setCredits}
          setSelectedCourses={props.setSelectedCourses}
          selectedCourses={props.selectedCourses}
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
          {props.credits === 0 ? '' : 'Selected Credits '}
        </Text>
        <Text style={{ fontWeight: '700' }}>
          {props.credits === 0 ? '' : props.credits.toFixed(2)}
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
          {props.major?.credits_required
            ? props.major?.credits_required.toFixed(2)
            : '0.0'}
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
          disabled={props.selectedCourses.length === 0}
          fullWidth
          onPress={() => props.setModalVisible(true)}
        >
          Edit Semesters
        </Button>
        <Modal
          animationType="slide"
          visible={props.modalVisible}
          onRequestClose={() => props.setModalVisible(false)}
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
                {props.selectedCourses.map((course, index) => {
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
                          props.handleEditSemester(course, e)
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
                <HelpCircle strokeWidth={3} />
                <Text style={{ fontSize: 12, marginLeft: 5 }}>
                  This allows goOHDARS to plan future schedules
                </Text>
              </View>
              <Button
                disabled={
                  props.selectedCourses.filter(
                    (course) =>
                      course.semester?.toString() === '' ||
                      course.semester === 0
                  ).length > 0
                }
                fullWidth
                onPress={props.handleContinuePress}
                loading={props.userLoading}
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

export default () => {
  const viewModel = useViewModel()
  return <OnboardingRoot {...viewModel} />
}
