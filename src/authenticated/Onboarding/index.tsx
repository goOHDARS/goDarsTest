import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import SelectedCourses from './SelectedCourses'
import Snackbar from '@components/Snackbar'
import {
  View,
  Text,
  ScrollView,
  Platform,
  Animated,
  Modal,
  Pressable,
  TextInput,
} from 'react-native'
import {
  AutocompleteDropdown,
} from 'react-native-autocomplete-dropdown'
import {
  HelpCircle,
  Info,
  Search,
} from 'react-native-feather'
import styles from './styles'
import useViewModel from './useViewModel'
import CourseOverview from './CourseOverview'

type Props = ReturnType<typeof useViewModel>

const OnboardingRoot = (props: Props) => {
  return (
    <ScreenLayout style={{ justifyContent: 'space-between' }} onDismissFunc={() => {
      props.editing ? props.setEditing(false) : undefined
    }}>
      <Animated.View
        style={{
          transform: [
            {translateY: props.translation},
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
        {props.infoVisible ?
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
          setEditing={props.setEditing}
        ></SelectedCourses>
      </ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          shadowColor: '#000', // For iOS shadow
          shadowOffset: { width: 0, height: -5 }, // Position the shadow above
          shadowOpacity: 0.2,
          shadowRadius: 10,
          backgroundColor: '#fff', // Ensure background color to see the shadow
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View style={{ width: '75%', alignContent: 'center', marginTop: '2.5%' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontWeight: '700' }}>
              {props.credits === 0 ? '' : 'Selected Credits '}
            </Text>
            <Text style={{ fontWeight: '700' }}>
              {props.credits === 0 ? '' : props.credits.toFixed(2)}
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{ fontWeight: '700' }}>
              {'Required Credits to Graduate '}
            </Text>
            <Text style={{ fontWeight: '700' }}>
              {props.major?.credits_required ? props.major?.credits_required.toFixed(2) : '0.0'}
            </Text>
          </View>
        </View>

        <Button
          disabled={props.selectedCourses.length === 0}
          fullWidth = {false}
          style={{ width: '90%', marginBottom: '5%' }}
          onPress={props.handleEditSemesters}
        >
          Continue
        </Button>
        <CourseOverview
          modalVisible={props.modalVisible}
          setModalVisible={props.setModalVisible}
          selectedCourses={props.selectedCourses}
          setSelectedCourses={props.setSelectedCourses}
          loading={props.userLoading}
        >
        </CourseOverview>
      </View>
    </ScreenLayout>
  )
}

export default () => {
  const viewModel = useViewModel()
  return <OnboardingRoot {...viewModel} />
}
