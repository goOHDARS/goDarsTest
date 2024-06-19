import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '100',
  },
  semesterContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    width: '50%',
    gap: 20,
  },
  fallSemesterText: {
    fontSize: 13,
    fontWeight: '200',
    color: 'white',
  },
  springSemesterText: {
    fontSize: 13,
    fontWeight: '200',
    color: 'white',
  },
  semesterInnerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  semesterInnerTextCredits: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    width: '15%',
    textAlign: 'center',
  },
  classContainer: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  classesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#00694E',
    borderRadius: 20,
    height: 300,
  },
  creditsText: {
    fontSize: 13,
    fontWeight: '200',
    color: 'white',
  },
  creditsValue: {
    fontSize: 24,
    fontWeight: '200',
    color: 'white',
  },
})
