import { useEffect, useState } from 'react'
import ScreenLayout from '@components/ScreenLayout'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import Button from '@components/Button'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootUnauthenticatedStackParamList } from '.'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { signUpUser } from '@actions/user'

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
  textBox: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#039942',
    marginBottom: 20,
    borderRadius: 10,
    height: 50,
    fontSize: 20,
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
  const errors = useAppSelector((state) => state.user.error)
  const loading = useAppSelector((state) => state.user.loading)
  const majorsList = useAppSelector((state) => state.majors.list)

  const { name, email, password } = route.params

  const currentMajors = majorsList?.map((major, index) => ({
    id: String(index + 1),
    title: major,
  })) ?? [{id: '1', title: 'whoops, something went wrong...'}]

  const currentGradeLevels = [
    { id: '1', title: 'Freshman' },
    { id: '2', title: 'Sophomore' },
    { id: '3', title: 'Junior' },
    { id: '4', title: 'Senior' },
  ]

  const handlePress = () => {
    // @Todo: add field for current semester
    dispatch(signUpUser(name, major, email, password, pid, +year, 4))
  }

  useEffect(() => {
    if (errors) {
      navigation.pop()
    }
  }, [errors])

  return (
    <ScreenLayout>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subHeader}>Additional Info</Text>
      <View style={styles.form}>
        <TextInput
          value={pid}
          onChangeText={(e) => setPid(e)}
          placeholderTextColor={'#000000'}
          placeholder="PID"
          style={styles.textBox}
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="text"
        />
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
        <Button
          disabled={!pid || !major || !year}
          color="#039942"
          fullWidth
          onPress={handlePress}
          loading={loading}
        >
          Finish Account
        </Button>
      </View>
    </ScreenLayout>
  )
}

export default AdditionalInfoScreen
