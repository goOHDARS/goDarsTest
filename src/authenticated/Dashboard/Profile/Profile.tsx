import { deleteAccount, GET_USER_REQUEST, sendResetPassEmail, SET_USER_FAILURE, SET_USER_SUCCESS, signOutUser } from '@actions/user'
import ScreenLayout from '@components/ScreenLayout'
import { Modal, View, TouchableOpacity, Text, Image, Alert } from 'react-native'
import { Edit2, Trash2 } from 'react-native-feather'
import ProfileCustomizer, { pokeResponse } from './ProfileCustomizer'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { useState } from 'react'
import Button from '@components/Button'

export default (
  {viewProfile, setViewProfile}
:
{viewProfile: boolean, setViewProfile: React.Dispatch<React.SetStateAction<boolean>>}
) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.user.user)
  const credits = useAppSelector((state) => state.courses.totalCredits)
  const [searching, setSearching] = useState(false)

  const [pokeDataOriginal, setPokeDataOriginal] = useState<pokeResponse>()
  const [pokeData, setPokeData] = useState<pokeResponse>()

  const [viewProfileCustomizer, setViewProfileCustomizer] = useState(false)

  const years = new Map<number, string>()
  years.set(1, 'Freshman')
  years.set(2, 'Sophomore')
  years.set(3, 'Junior')
  years.set(4, 'Senior')

  if (!user || !viewProfile) {
    return null
  }

  const fetchData = async () => {
    dispatch({
      type: GET_USER_REQUEST,
    })

    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025')
      const pokeData = await response.json()

      if (pokeData && response.ok && user) {
        const pokeDataTyped = pokeData as pokeResponse

        let i = pokeDataTyped.results.length - 1
        while (i > 0 && pokeDataTyped.results[i].url !== user?.photoURL) {
          pokeDataTyped.results[i].url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`
          pokeDataTyped.results[i].name = pokeDataTyped.results[i - 1].name
          i--
        }

        if (pokeDataTyped.results[i].url === user.photoURL) {
          i -= 1
          while (i > 0) {
            pokeDataTyped.results[i].url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`
            pokeDataTyped.results[i].name = pokeDataTyped.results[i - 1].name
            i--
          }
        }

        if (user) {
          const index = pokeDataTyped.results.findIndex((poke) => poke.url === user.photoURL)
          pokeDataTyped.results[0] = pokeDataTyped.results[index]
        }

        setPokeData(pokeDataTyped)
        setPokeDataOriginal(pokeDataTyped)
        dispatch({
          type: SET_USER_SUCCESS,
          payload: {
            ...user,
          },
        })
      }
    } catch (error: any) {
      dispatch({
        type: SET_USER_FAILURE,
        payload: {
          ...user,
        },
      })
      setViewProfileCustomizer(false)
      Alert.alert('goOHDARS', 'Couldn\'t perform that action. Please try again later.', [
        {
          text: 'Confirm',
          style: 'default',
        },
      ])

      console.log(error.message)
    }
  }

  return (
    <Modal animationType='slide' visible={viewProfile}
      onRequestClose={() => setViewProfile(false)} presentationStyle='pageSheet'>
      <ScreenLayout>
        <View style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%'}}>
          <View style={{ width: '10%', height: 3, backgroundColor: 'lightgray', alignSelf: 'center', marginVertical: 5, borderRadius: 100}}>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', width: '90%', alignSelf: 'center', gap: 10, height: '15%', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text style={{ color: '#039942', fontSize: 36, fontWeight: '900' }}>
              goOHDARS
            </Text>
            <TouchableOpacity onPress={async () => {
              await fetchData(), setViewProfileCustomizer(true), setSearching(false)
            }}>
              <View>
                <Image
                  style={{ width: 90, height: 90, borderRadius: 100, borderColor: user?.borderURLColor, borderWidth: 1, alignSelf: 'flex-end'}}
                  source={{ uri: user?.photoURL }}
                  alt="user profile picture"
                ></Image>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'black',
                    borderWidth: 1,
                  }}>
                  <Edit2 color='black' width={15} height={15} ></Edit2>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{fontSize: 34, fontWeight: '100', textTransform: 'capitalize', marginLeft: '10%', marginBottom: '2.5%'}}>{user?.name}</Text>
          <View style={{ display: 'flex', flexDirection: 'column', marginLeft: '10%' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontSize: 24, fontWeight: '200' }}>{years.has(Math.floor(user?.semester / 2) + 1) ? years.get(Math.floor(user?.semester / 2) + 1) : user?.semester}</Text>
              <Text style={{ fontWeight: '100', fontSize: 12 }}>  in  </Text>
              <Text style={{fontSize: 20, fontWeight: '200', textTransform: 'capitalize'}}>{user?.major}</Text>
            </View>
          </View>
          <View style={{ gap: 10, height: '45%', alignSelf: 'flex-start', marginVertical: '5%', marginLeft: '15%'}}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: '800', color: '#039942'}}>
                {'PID '}
              </Text>
              <Text style={{fontSize: 20, fontWeight: '200'}}>{user.pid}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{fontSize: 20, fontWeight: '800', color: '#039942'}}>
                {'Email: '}
              </Text>
              <Text style={{fontSize: 20, fontWeight: '200'}}>{user.email}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{fontSize: 20, fontWeight: '800', color: '#039942'}}>
                {'Credits: '}
              </Text>
              <Text style={{fontSize: 20, fontWeight: '200'}}>{credits}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{fontSize: 20, fontWeight: '800', color: '#039942'}}>
                {'GPA: '}
              </Text>
              {/* <Text style={{fontSize: 20, fontWeight: '200'}}>{user.gpa}</Text> */}
            </View>
          </View>
          <View style={{ width: '90%', alignSelf: 'center', gap: 5 }}>
            <Button
              onPress={() => sendResetPassEmail(user.email)}
            >
              Reset Password
            </Button>
            <TouchableOpacity
              onPress={() => deleteAccount()}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderRadius: 10,
                backgroundColor: '#039942',
                gap: 10,
              }}>
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontWeight: '600',
              }}>
                    Delete Account
              </Text>
              <Trash2 color='white' width={25} height={25} strokeWidth={2.25}></Trash2>
            </TouchableOpacity>
          </View>


          {/* <Text style={{fontSize: 20, fontWeight: '500', color: 'red'}}>Reset Password</Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Trash2 color='red' width={25} height={25} strokeWidth={3}></Trash2>
            <Text style={{fontSize: 14, fontWeight: '700', color: 'red'}}>
                Delete Account
            </Text>
          </View> */}
          <ProfileCustomizer
            viewProfileCustomizer={viewProfileCustomizer}
            setViewProfileCustomizer={setViewProfileCustomizer}
            pokeData={pokeData}
            setPokeData={setPokeData}
            pokeDataOriginal={pokeDataOriginal}
            setPokeDataOriginal={setPokeDataOriginal}
            searching={searching}
            setSearching={setSearching}
          >
          </ProfileCustomizer>
          {/* <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 5, width: '75%', alignItems: 'center'}}>
              <HelpCircle color={'black'} width={20} height={20}></HelpCircle>
              <Text>Users who scan this QR Code can view your planned schedule.</Text>
            </View>
            <Image
              style={{ width: '45%', height: '25%', borderColor: 'black', borderWidth: 2, alignSelf: 'center', borderRadius: 20}}
              source={require('../../assets/image.png')}
              alt="user profile picture"
            ></Image> */}
        </View>
      </ScreenLayout>
    </Modal>
  )
}
