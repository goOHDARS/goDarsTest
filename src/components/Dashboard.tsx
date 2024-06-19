import React from 'react'
import Modal from 'react-native-modal'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Archive, HelpCircle, LogOut, User, X } from 'react-native-feather'
import { signOutUser } from '@actions/user'
import { useAppDispatch } from '@hooks/store'

const styles = StyleSheet.create({
  xButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    borderRadius: 100,
  },
  modalHeaderContainer1: {
    width: '50%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modal: {
    height: '50%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  modalHeaderContainer2: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '200',
    right: 10,
  },
  modalMainContainer: {
    display: 'flex',
    width: '100%',
    height: '85%',
    justifyContent: 'center',
  },
  organizationContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '40%',
    width: '100%',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModalContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    width: '45%',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
})

export default (
  {
    viewExtras, setViewExtras,
    viewProfile, setViewProfile,
    viewFulfilledBricks, setViewFulfilledBricks,
    viewWhatIfDARS, setViewWhatIfDARS,
  } :
{viewExtras: boolean, setViewExtras: React.Dispatch<React.SetStateAction<boolean>>,
viewProfile: boolean, setViewProfile: React.Dispatch<React.SetStateAction<boolean>>,
viewFulfilledBricks: boolean, setViewFulfilledBricks: React.Dispatch<React.SetStateAction<boolean>>,
viewWhatIfDARS: boolean, setViewWhatIfDARS: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const dispatch = useAppDispatch()

  return (
    <Modal
      backdropTransitionOutTiming={850}
      backdropTransitionInTiming={850}
      animationOutTiming={550}
      animationInTiming={350}
      onBackButtonPress={() => {
        setViewExtras(false)
      }}
      onBackdropPress={() => {
        setViewExtras(false)
      }}
      animationIn={'fadeInLeft'}
      animationOut={'fadeOutRight'}
      style={{ height: '100%', width: '90%'}}
      isVisible={viewExtras}>
      <View style={styles.modal}>
        <View style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '15%'}}>
          <View style={styles.modalHeaderContainer2}>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <View style={styles.modalHeaderContainer1}>
            <TouchableOpacity onPress={() => {
              setViewExtras(false)
            }} style={styles.xButton}>
              <X color={'gray'} strokeWidth={3} width={25} height={25} style={{ zIndex: 0, elevation: 0 }}></X>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.modalMainContainer}>
          <View style={styles.organizationContainer}>
            <TouchableOpacity onPress={() => {
              setTimeout(() => {
                setViewProfile(true)
              }, 850), console.log(viewProfile), setViewExtras(false), console.log(viewProfile)
            }} style={styles.innerModalContainer}>
              <User color={'hotpink'} width={25} height={25} strokeWidth={3}></User>
              <Text style={{ color: 'hotpink', fontWeight: '700' }}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setViewFulfilledBricks(true), setViewExtras(false)
            }} style={styles.innerModalContainer}>
              <Archive color={'black'} width={25} height={25} strokeWidth={3}></Archive>
              <Text style={{ color: 'black', fontWeight: '700' }}>Fulfilled Bricks</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.organizationContainer}>
            <TouchableOpacity onPress={() => {
              setViewWhatIfDARS(true), setViewExtras(false)
            }} style={styles.innerModalContainer}>
              <HelpCircle color={'#039942'} width={25} height={25} strokeWidth={3}></HelpCircle>
              <Text style={{ color: '#039942', fontWeight: '700' }}>What if DARS?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setViewExtras(false), dispatch(signOutUser())
            }} style={styles.innerModalContainer}>
              <LogOut color={'red'} width={25} height={25} strokeWidth={3}></LogOut>
              <Text style={{ fontSize: 16, fontWeight: '600', color: 'red'}}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
