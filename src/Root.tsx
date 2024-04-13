import React from 'react'
import { Text, StyleSheet, SafeAreaView } from 'react-native'
import useHandleAuthState from './hooks/useHandleAuthState'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
})

const Root = () => {
  useHandleAuthState()

  return (
    <SafeAreaView style={styles.container}>
      <Text>This is the root.</Text>
    </SafeAreaView>
  )
}

export default Root
