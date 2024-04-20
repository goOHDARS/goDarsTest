import React from 'react'
import { ActivityIndicator, StyleSheet, Text } from 'react-native'
import ScreenLayout from '@components/ScreenLayout'

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

const FullScreenLoader = () => {
  return (
    <ScreenLayout>
      <Text style={styles.header}>goOHDARS</Text>
      <Text style={styles.subtitle}>An alternative to DARS.</Text>
      <ActivityIndicator color="#039942" size="large" />
    </ScreenLayout>
  )
}

export default FullScreenLoader
