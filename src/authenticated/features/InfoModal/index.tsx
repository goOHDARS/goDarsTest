import { Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import styles from './styles'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { useEffect } from 'react'
import {
  addUserCourse,
  getCourseInfo,
  removeUserCourse,
} from '@actions/courses'
import { X } from 'react-native-feather'
import Button from '@components/Button'
import { CourseBrief } from 'src/reducers/courses'

type Props = {
  brief?: CourseBrief
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const useViewModel = (props: Props) => {
  const dispatch = useAppDispatch()
  const { selectedCourse, loading } = useAppSelector((state) => state.courses)

  useEffect(() => {
    if (props.brief?.shortName) {
      dispatch(getCourseInfo(props.brief.shortName))
    }
  }, [props.brief?.shortName])

  const handlePress = () => {
    if (!selectedCourse || !props.brief) return

    props.setVisible(false)
    if (!props.brief.suggestion) {
      dispatch(removeUserCourse(props.brief.shortName))
    } else {
      dispatch(
        addUserCourse({
          course: props.brief.shortName,
          semester: props.brief.semester ?? 1,
          category: props.brief.category,
          subcategory: props.brief.subcategory,
        })
      )
    }
  }

  return { selectedCourse, loading, handlePress, ...props }
}

type RootProps = ReturnType<typeof useViewModel>

const InfoModalRoot = (props: RootProps) => {
  return (
    <Modal
      backdropTransitionOutTiming={850}
      backdropTransitionInTiming={850}
      animationOutTiming={550}
      animationInTiming={350}
      onBackdropPress={() => props.setVisible(false)}
      animationIn="slideInDown"
      animationOut="slideOutDown"
      isVisible={props.visible && !props.loading}
    >
      <View style={styles.constainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            style={{ padding: 5, borderRadius: 10 }}
            onPress={() => props.setVisible(false)}
          >
            <X color="#000000" strokeWidth={3} width={25} height={25} />
          </TouchableOpacity>
          <View style={{ display: 'flex', gap: 10, width: '90%' }}>
            <Text style={styles.title}>{props.selectedCourse?.fullName}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 10,
              }}
            >
              <Text style={styles.subtitle}>
                {props.selectedCourse?.shortName}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>•</Text>
              <Text style={styles.subtitle}>
                {props.selectedCourse?.credits} credits
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>•</Text>
              <Text style={styles.subtitle}>
                {props.selectedCourse?.college}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', width: '100%', marginBottom: 20 }}>
          <Text>
            {'\t'}
            {props.selectedCourse?.description}
          </Text>
        </View>
        <Button
          onPress={props.handlePress}
          fullWidth
          color={!props.brief?.suggestion ? '#ED4337' : '#039942'}
        >
          {!props.brief?.suggestion ? 'Remove From Schedule' : 'Add Course'}
        </Button>
      </View>
    </Modal>
  )
}

export default (props: Props) => {
  const viewModel = useViewModel(props)
  return <InfoModalRoot {...viewModel} />
}
