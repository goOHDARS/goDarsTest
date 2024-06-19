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
  },
})

type Props = {
  children: React.ReactNode
  style?: ViewStyle
  extraStyles?: ViewStyle
  onDismissFunc?: () => void
}

const ScreenLayout = ({ children, style, onDismissFunc, extraStyles }: Props) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        extraStyles ?? {},
        { marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
      ]}
    >
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss(), onDismissFunc && onDismissFunc()
        }}
        accessible={false}
      >
        <View style={[styles.container, style ?? {}]}>{children}</View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default ScreenLayout
