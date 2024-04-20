import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootUnauthenticatedStackParamList } from '.'
import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, View } from 'react-native'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { resetUserErrors } from '@actions/user'

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: '90%',
  },
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
})

type Props = NativeStackScreenProps<
  RootUnauthenticatedStackParamList,
  '/signup'
>

const SignUpScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const errors = useAppSelector((state) => state.user.error)

  const handlePress = () => {
    dispatch(resetUserErrors())
    navigation.push('/additional-info', {
      name,
      email,
      password,
    })
  }

  return (
    <ScreenLayout style={{ justifyContent: 'flex-start' }}>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subHeader}>Sign Up</Text>
      <View style={styles.form}>
        <TextInput
          value={name}
          onChangeText={(e) => setName(e)}
          placeholderTextColor={'black'}
          placeholder="Full Name"
          style={styles.textBox}
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="text"
        />
        <TextInput
          value={email}
          onChangeText={(e) => setEmail(e)}
          placeholder="Email"
          placeholderTextColor={'black'}
          style={styles.textBox}
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          onChangeText={(e) => setPassword(e)}
          placeholder="Password"
          placeholderTextColor={'black'}
          style={styles.textBox}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        {errors && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.message}</Text>
          </View>
        )}
        <Button
          disabled={!name || !email || !password}
          fullWidth
          onPress={handlePress}
        >
          Continue
        </Button>
        <View style={styles.linkArea}>
          <Text style={{ fontSize: 18 }}>Already have an account?</Text>
          <Button
            style={{ marginLeft: 10 }}
            noFill
            onPress={() => navigation.push('/signin')}
          >
            Sign In
          </Button>
        </View>
      </View>
    </ScreenLayout>
  )
}

export default SignUpScreen
