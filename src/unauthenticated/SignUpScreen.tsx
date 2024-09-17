import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootUnauthenticatedStackParamList } from '.'
import React, { useState } from 'react'
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { resetUserErrors } from '@actions/user'
import { Eye } from 'react-native-feather'
import PasswordRequirements from '@components/PasswordRequirements'
import { isProfane } from 'no-profanity'

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: '90%',
    gap: 10,
  },
  header: {
    fontSize: 50,
    fontWeight: '900',
    color: '#039942',
    marginTop: '10%',
  },
  subHeader: {
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: '5%',
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
    borderRadius: 10,
    height: 50,
    fontSize: 20,
  },
  errorContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: 20,
    paddingLeft: 10,
  },
  errorText: {
    color: 'red',
    fontWeight: '700',
  },
  linkArea: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
  },
  disabledInputTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#039942',
    height: 50,
    width: 40,
    borderRadius: 10,
  },
  disabledInputText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  textBoxInput: {
    display: 'flex',
    fontSize: 20,
    paddingLeft: 12.5,
    height: 50,
    width: '85%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
})

type Props = NativeStackScreenProps<
  RootUnauthenticatedStackParamList,
  '/signup'
>

const SignUpScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()

  const [FName, setFName] = useState('')
  const [LName, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const errors = useAppSelector((state) => state.user.error)

  const checkNames = (name: string) => {
    return (
      name.length < 1 ||
      name.match(/[^A-Za-z0-9]/) !== null ||
      name.match(/[0-9]/) !== null ||
      isProfane(name)
    )
  }

  const handlePress = () => {
    dispatch(resetUserErrors())
    navigation.push('/additional-info', {
      name: FName + ' ' + LName,
      email,
      password,
    })
  }

  const handleLinkPress = () => {
    dispatch(resetUserErrors())
    navigation.push('/signin')
  }

  return (
    <ScreenLayout style={{ justifyContent: 'flex-start' }}>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subHeader}>Sign Up</Text>
      <View style={styles.form}>
        <View style={{ width: '100%', gap: 10, marginBottom: 15 }}>
          <TextInput
            value={FName}
            onChangeText={(e) => setFName(e)}
            placeholderTextColor={'black'}
            placeholder="First Name"
            style={styles.textBox2}
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="text"
          />
          <TextInput
            value={LName}
            onChangeText={(e) => setLName(e)}
            placeholderTextColor={'black'}
            placeholder="Last Name"
            style={styles.textBox2}
            autoCapitalize="none"
            autoCorrect={false}
            inputMode="text"
          />
          { (checkNames(FName) || checkNames(LName)) ? <Text style={{ alignSelf: 'center', fontWeight: '800', color: '#039942', fontSize: 10 }}>Please enter a valid name</Text>: null}
        </View>
        <TextInput
          value={email}
          onChangeText={(e) => setEmail(e)}
          placeholder="Email"
          placeholderTextColor={'black'}
          style={styles.textBox2}
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          keyboardType="email-address"
        />
        <View style={styles.textBox}>
          <TextInput
            value={password}
            onChangeText={(e) => setPassword(e)}
            placeholder="Password"
            placeholderTextColor={'black'}
            style={styles.textBoxInput}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: '15%',
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            {password ? (
              <Eye color={'black'} strokeWidth={1} width={20}></Eye>
            ) : null}
            <Text style={{ fontSize: 11 }}>
              {password ? (!showPassword ? 'show' : 'hide') : null}
            </Text>
          </TouchableOpacity>
        </View>
        {errors && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.message}</Text>
          </View>
        )}
        <PasswordRequirements password={password} />
        <Button
          disabled={
            !FName ||
            !LName ||
            !email ||
            !password ||
            password.length < 8 ||
            !password.match(/[^A-Za-z0-9]/) ||
            !password.match(/[A-Z]/) ||
            !password.match(/[0-9]/) ||

            checkNames(FName) ||
            checkNames(LName)
          }
          fullWidth
          onPress={handlePress}
        >
          Continue
        </Button>
        <View style={styles.linkArea}>
          <Text style={{ fontSize: 18 }}>Already have an account?</Text>
          <Button style={{ marginLeft: 10 }} noFill onPress={handleLinkPress}>
            Sign In
          </Button>
        </View>
      </View>
    </ScreenLayout>
  )
}

export default SignUpScreen
