import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  messageContainer: {
    display: 'flex',
    paddingHorizontal: 10,
    paddingTop: 20,
    rowGap: 20,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 10,
    margin: 10,
    paddingLeft: 10,
    paddingRight: 5,
    borderWidth: 1,
    borderColor: '#039942',
    borderRadius: 10,
  },
  message: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 35,
    backgroundColor: '#116b29',
    width: 'auto',
    alignSelf: 'flex-start',
    padding: 10,
    maxWidth: '80%',
    borderRadius: 10,
  },
  textInput: {
    height: 50,
    fontSize: 15,
    flex: 5,
  },
  button: {
    height: 40,
  },
})
