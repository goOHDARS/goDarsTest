import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 50,
    fontWeight: '900',
    color: '#039942',
  },
  title2: {
    fontSize: 30,
    fontWeight: '900',
    color: '#039942',
  },
  textBoxInput: {
    display: 'flex',
    fontSize: 20,
    height: 50,
    width: '90%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  textBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#039942',
    borderRadius: 10,
    height: 50,
  },
  disabledInputTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#039942',
    height: 50,
    width: 40,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  icon: {
    color: '#ffffff',
  },
  dropDownText: {
    fontSize: 20,
    height: 50,
  },
  dropDownInput: {
    borderRadius: 10,
    backgroundColor: '#ffffff00',
    width: '100%',
  },
  clipboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
  },
  clipboard: {
    display: 'flex',
    fontSize: 24,
    textAlign: 'left',
    fontWeight: '200',
    textTransform: 'uppercase',
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  editCourseText: {
    fontSize: 12,
    width: '30%',
    textAlign: 'center',
  },
  editCourseTextLeft: {
    fontSize: 12,
    width: '30%',
    textAlign: 'left',
  },
  editCourseTextRight: {
    fontSize: 12,
    width: '30%',
    textAlign: 'right',
  },
})
