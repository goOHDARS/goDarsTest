import React from 'react'
import { StyleSheet, Text } from 'react-native'
import ScreenLayout from '@components/ScreenLayout'
import Button from '@components/Button'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootUnauthenticatedStackParamList } from '.'
import { setKey } from '@utils/storage'

const styles = StyleSheet.create({
  header: {
    marginBottom: 5,
    fontSize: 50,
    fontWeight: '900',
    color: '#039942',
  },
  subtitle: {
    marginBottom: 50,
    fontSize: 18,
    fontWeight: '600',
  },
})

type Props = NativeStackScreenProps<
  RootUnauthenticatedStackParamList,
  '/landing'
>

const LandingScreen = ({ navigation }: Props) => {
  const handlePress = () => {
    setKey('has_visited')
    navigation.push('/signup')
  }

  return (
    <ScreenLayout>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subtitle}>An alternative to DARS.</Text>
      <Button onPress={handlePress}>Get Started</Button>
    </ScreenLayout>
  )
}

export default LandingScreen
