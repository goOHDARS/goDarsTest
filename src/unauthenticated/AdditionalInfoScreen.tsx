import { useEffect, useState } from 'react'
import ScreenLayout from '@components/ScreenLayout'
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import Button from '@components/Button'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootUnauthenticatedStackParamList } from '.'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { signUpUser } from '@actions/user'
import { getMajorsList } from '@actions/majors'

const styles = StyleSheet.create({
  header: {
    fontSize: 50,
    fontWeight: '900',
    color: '#039942',
  },
  subHeader: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: '30%',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: '90%',
  },
  formInline: {
    display: 'flex',
    flexDirection: 'row',
  },
  textBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#039942',
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
  },
  textBox2: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#039942',
    marginBottom: 20,
    borderRadius: 10,
    height: 50,
    fontSize: 20,
  },
  textBoxInput: {
    display: 'flex',
    fontSize: 20,
    paddingLeft: 12.5,
    height: 50,
    width: '90%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
  disabledInputText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  dropDown: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#039942',
    marginBottom: 20,
  },
  dropDownInput: {
    borderRadius: 10,
    backgroundColor: '#ffffff00',
  },
  dropDownText: {
    fontSize: 20,
    height: 50,
  },
})

type Props = NativeStackScreenProps<
  RootUnauthenticatedStackParamList,
  '/additional-info'
>

const AdditionalInfoScreen = ({ route, navigation }: Props) => {
  const dispatch = useAppDispatch()
  const [pid, setPid] = useState('')
  const [major, setMajor] = useState('')
  const [year, setYear] = useState('')
  const [semester, setSemester] = useState('')
  const errors = useAppSelector((state) => state.user.error)
  const loading = useAppSelector((state) => state.user.loading)
  const majorsList = useAppSelector((state) => state.majors.list)

  const { name, email, password } = route.params

  const currentMajors = majorsList?.map((major, index) => ({
    id: String(index + 1),
    title: major,
  })) ?? [{ id: '1', title: 'whoops, something went wrong...' }]

  const currentGradeLevels = [
    { id: '1', title: 'Freshman' },
    { id: '2', title: 'Sophomore' },
    { id: '3', title: 'Junior' },
    { id: '4', title: 'Senior' },
  ]

  const handlePress = () => {
    dispatch(
      signUpUser(name, major, email, password, 'P' + pid, +year, +semester),
    )
  }

  useEffect(() => {
    if (errors) {
      navigation.pop()
    }
    if (majorsList?.length === 1 && majorsList[0] === 'whoops, something went wrong...') {
      dispatch(getMajorsList())
    }
  }, [errors, majorsList])

  return (
    <ScreenLayout>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subHeader}>Additional Info</Text>
      <View style={styles.form}>
        <View style={styles.textBox}>
          <View style={styles.disabledInputTextContainer}>
            <Text style={styles.disabledInputText}>P</Text>
          </View>
          <TextInput
            value={pid}
            onChangeText={(e) => setPid(e)}
            placeholderTextColor={'#000000'}
            placeholder="101..."
            style={styles.textBoxInput}
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="decimal"
          />
        </View>
        <AutocompleteDropdown
          containerStyle={styles.dropDown}
          textInputProps={{
            style: styles.dropDownText,
            placeholder: 'Current Major',
            placeholderTextColor: '#000000',
          }}
          inputContainerStyle={styles.dropDownInput}
          rightButtonsContainerStyle={{ height: 50 }}
          onSelectItem={(item) => setMajor(item?.title ?? '')}
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={false}
          dataSet={currentMajors}
          direction={Platform.OS === 'ios' ? 'down' : 'up'}
        />
        <AutocompleteDropdown
          containerStyle={styles.dropDown}
          textInputProps={{
            style: styles.dropDownText,
            placeholder: 'Current Grade',
            placeholderTextColor: '#000000',
          }}
          inputContainerStyle={styles.dropDownInput}
          rightButtonsContainerStyle={{ height: 50 }}
          onSelectItem={(item) => setYear(item?.id ?? '')}
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={false}
          dataSet={currentGradeLevels}
        />
        <TextInput
          value={semester}
          onChangeText={(e) => setSemester(e)}
          placeholder="Current Semester"
          placeholderTextColor={'black'}
          style={styles.textBox2}
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="numeric"
          keyboardType="number-pad"
        />
        <Button
          disabled={
            !pid ||
            !major ||
            major === 'whoops, something went wrong...' ||
            !year ||
            pid.length != 9 ||
            +semester < 1
          }
          color="#039942"
          fullWidth
          onPress={handlePress}
          loading={loading}
        >
          Continue
        </Button>
      </View>
    </ScreenLayout>
  )
}

export default AdditionalInfoScreen
