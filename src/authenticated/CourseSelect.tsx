import ScreenLayout from '@components/ScreenLayout'
import {
  Text,
  View,
  StyleSheet,
  Platform,
} from 'react-native'
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { RootAuthenticatedTabBarParamList } from '.'
import { Search } from 'react-native-feather'
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown'
import { CourseBrief } from 'src/reducers/courses'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { queryCourses } from '@actions/courses'

type Props = BottomTabScreenProps<
  RootAuthenticatedTabBarParamList,
  '/course-select'
>

const CourseSelect = (props: Props) => {
  const handleSelectCourse = (course: TAutocompleteDropdownItem) => {
    console.log(course)
  }

  const dispatch = useAppDispatch()
  const courses = useAppSelector((state) => state.courses.queryResults)

  const [dataSet, setDataSet] = useState<TAutocompleteDropdownItem[]>([])
  const [query, setQuery] = useState<string>('')

  useEffect(() => {
    dispatch(queryCourses(query))
    setDataSet(courses?.map((course, index) => {
      return {
        id: course.id,
        title: course.shortName,
      }
    }) ?? [])
  }, [query])

  return (
    <ScreenLayout>
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <View style={styles.textBox}>
          <View style={styles.disabledInputTextContainer}>
            <Search color={'#ffffff'} strokeWidth={3}></Search>
          </View>
          <AutocompleteDropdown
            onChangeText={(e) => setQuery(e)}
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
            emptyResultText="Search by course code or name"
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
    </ScreenLayout>
  )
}

const styles = StyleSheet.create({
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
  dropDownText: {
    fontSize: 20,
    height: 50,
  },
  dropDownInput: {
    borderRadius: 10,
    backgroundColor: '#ffffff00',
    width: '100%',
  },
})

export default CourseSelect
