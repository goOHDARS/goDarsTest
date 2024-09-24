import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import Button from '@components/Button'
import Loader from 'react-native-three-dots'
import styles from './styles'
import useViewModel from './useViewModel'

type Props = ReturnType<typeof useViewModel>

const ChatScreenRoot = (props: Props) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={55}
    >
      <ScrollView
        ref={props.scrollViewRef}
        onContentSizeChange={() =>
          props.scrollViewRef.current?.scrollToEnd({ animated: true })
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
      <View style={styles.actionsContainer}>
        <TextInput
          ref={props.textInputRef}
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
      </View>
    </KeyboardAvoidingView>
  )
}

export default () => {
  const viewModel = useViewModel()
  return <ChatScreenRoot {...viewModel} />
}
