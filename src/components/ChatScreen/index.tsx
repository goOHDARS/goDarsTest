import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import Button from '../Button'
import { useRef } from 'react'
import Loader from 'react-native-three-dots'
import styles from './styles'
import useViewModel from './useViewModel'

type Props = ReturnType<typeof useViewModel>

const ChatScreenRoot = (props: Props) => {
  const scrollViewRef = useRef<ScrollView>(null)

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        contentContainerStyle={styles.messageContainer}
      >
        {props.currentMessages
          .filter((message) => message.role !== 'system')
          .map((message, index) => (
            <Pressable key={index} style={{ display: 'flex' }}>
              <View
                style={{
                  ...styles.message,
                  ...(message.role === 'user'
                    ? { alignSelf: 'flex-end', backgroundColor: '#039942' }
                    : {}),
                }}
              >
                <Text style={{ color: '#ffffff' }}>{message.content}</Text>
              </View>
            </Pressable>
          ))}
        {props.loading && (
          <Pressable style={{ display: 'flex' }}>
            <View style={styles.message}>
              <Loader speed={200} color="#ffffff" />
            </View>
          </Pressable>
        )}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.actionsContainer}
      >
        <TextInput
          style={styles.textInput}
          value={props.message}
          onChangeText={props.setMessage}
          selectionColor="#039942"
          placeholder="Type a message..."
        />
        <Button
          disabled={!props.message || props.loading}
          style={styles.button}
          textStyle={{ fontSize: 15 }}
          onPress={props.handleSend}
        >
          Send
        </Button>
      </KeyboardAvoidingView>
    </View>
  )
}

export default () => {
  const viewModel = useViewModel()
  return <ChatScreenRoot {...viewModel} />
}
