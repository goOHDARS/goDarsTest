import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    fontWeight: '900',
  },
})

export default (
  {password} : {password: string}
) => {
  const hasEightChars = password.length >= 8
  const hasOneUpperCase = password.match(/[A-Z]/)
  const hasOneNumber = password.match(/[0-9]/)
  const hasOneSpecialChar = password.match(/[^A-Za-z0-9]/)

  return (
    hasEightChars && hasOneNumber && hasOneUpperCase && hasOneSpecialChar ? null :
      <View style={{ alignSelf: 'flex-start', margin: 20, marginTop: 0}}>
        <Text style={{ fontSize: 14 }}>
                Password must contain:
        </Text>
        {hasEightChars ? null :
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{ fontSize: 6}}>
              {'\u25CF '}
            </Text>
            <Text style={{ fontSize: 11}}>
                        At least 8 characters
            </Text>
          </View>
        }
        {hasOneUpperCase ? null :
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{ fontSize: 6}}>
              {'\u25CF '}
            </Text>
            <Text style={{ fontSize: 11}}>
                        At least 1 uppercase letter
            </Text>
          </View>
        }
        {hasOneNumber ? null :
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{ fontSize: 6}}>
              {'\u25CF '}
            </Text>
            <Text style={{ fontSize: 11}}>
                        At least 1 number
            </Text>
          </View>
        }
        {hasOneSpecialChar ? null :
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{ fontSize: 6}}>
              {'\u25CF '}
            </Text>
            <Text style={{ fontSize: 11}}>
                        At least 1 special character
            </Text>
          </View>
        }
      </View>
  )
}
