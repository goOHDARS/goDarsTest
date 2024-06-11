import React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})

type Props = {
  children: React.ReactNode
  style?: ViewStyle
}

const ScreenLayout = ({ children, style }: Props) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
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
