import Button from '@components/Button'
import ScreenLayout from '@components/ScreenLayout'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native'
import { RootUnauthenticatedStackParamList } from '.'
import { resetUserErrors, signInUser } from '@actions/user'
import { Eye } from 'react-native-feather'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
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
  textBox2: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#039942',
    borderRadius: 10,
    height: 50,
    fontSize: 20,
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
  textBoxInput: {
    display: 'flex',
    fontSize: 20,
    paddingLeft: 12.5,
    height: 50,
    width: '85%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
  const [showPassword, setShowPassword] = useState(false)

  const loading = useAppSelector((state) => state.user.loading)
  const errors = useAppSelector((state) => state.user.error)

  const handlePress = () => {
    dispatch(signInUser(email, password))
  }

  const handleLinkPress = () => {
    dispatch(resetUserErrors())
    navigation.push('/signup')
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
          <Button style={{ marginLeft: 10 }} noFill onPress={handleLinkPress}>
            Sign Up
          </Button>
        </View>
      </View>
    </ScreenLayout>
  )
}

export default SignInScreen
