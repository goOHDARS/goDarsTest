import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native'

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
})

type Props = {
  children: string
  color?: string
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  noFill?: boolean
}

const Button = ({
  children,
  style,
  textStyle,
  onPress,
  color = '#039942',
  fullWidth = false,
  disabled = false,
  loading = false,
  noFill = false,
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        style ?? {},
        {
          backgroundColor: noFill
            ? '#00000000'
            : `${color}${disabled || loading ? '77' : ''}`,
          ...(fullWidth ? { width: '100%' } : {}),
          ...(noFill ? { padding: 0 } : {}),
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          {
            ...(noFill ? { color: '#039942', fontSize: 18 } : {}),
          },
          textStyle ?? {},
        ]}
      >
        {children}
      </Text>
      {loading && (
        <ActivityIndicator color="#FFFFFF" style={{ marginLeft: 10 }} />
      )}
    </TouchableOpacity>
  )
}

export default Button
