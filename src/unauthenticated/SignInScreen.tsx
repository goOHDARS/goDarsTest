import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, View } from 'react-native'
import { RootUnauthenticatedStackParamList } from '.'
import { signInUser } from '@actions/user'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
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
  linkArea: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
  },
})

type Props = NativeStackScreenProps<
  RootUnauthenticatedStackParamList,
  '/signin'
>

const SignInScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loading = useAppSelector((state) => state.user.loading)
  const errors = useAppSelector((state) => state.user.error)

  const handlePress = async () => {
    await dispatch(signInUser(email, password))
  }

  return (
    <ScreenLayout style={styles.container}>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subHeader}>Sign In</Text>
      <View style={styles.form}>
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
          disabled={!email || !password}
          fullWidth
          onPress={handlePress}
          loading={loading}
        >
          Sign In
        </Button>
        <View style={styles.linkArea}>
          <Text style={{ fontSize: 18 }}>Don't have an account?</Text>
          <Button
            style={{ marginLeft: 10 }}
            noFill
            onPress={() => navigation.push('/signup')}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </ScreenLayout>
  )
}

export default SignInScreen
