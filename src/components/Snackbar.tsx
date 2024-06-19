import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const Snackbar = ({
  message = '',
  visible = false,
  actionText = '',
  onActionPress = () => {
    return
  },
}) => {
  return visible ? (

    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  ) : (
    <View style={{ height: 50 }}></View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: '#039942',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    left: 0,
    right: 0,
    height: 50,
    width: '95%',
  },
  messageText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '300',
    marginHorizontal: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '800',
    marginHorizontal: 10,
  },
})

export default Snackbar
