import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type Props = {
  children: React.ReactNode
  style?: ViewStyle
}

const ScreenLayout = ({ children, style }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={Keyboard.dismiss}
        accessible={false}
      >
        <View style={[styles.container, style ?? {}]}>{children}</View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default ScreenLayout
