import {
  GET_RESPONSE_SUCCESS,
  clearConversation,
  createConversation,
  getResponse,
} from '@actions/conversations'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import { useEffect, useState, useRef } from 'react'
import { ScrollView, TextInput } from 'react-native'
import { Message } from 'src/reducers/conversations'

const useViewModel = () => {
  const dispatch = useAppDispatch()
  const [message, setMessage] = useState('')
  const scrollViewRef = useRef<ScrollView>(null)
  const textInputRef = useRef<TextInput>(null)

  const { currentConversation, loading } = useAppSelector(
    (state) => state.conversations
  )

  const handleSend = () => {
    const newMessage: Message = {
      role: 'user',
      content: message,
    }

    // add slight delay for smooth transition
    setTimeout(() => {
      if (currentConversation) {
        dispatch(getResponse(currentConversation.id, [newMessage]))
      }
    }, 500)

    dispatch({
      type: GET_RESPONSE_SUCCESS,
      payload: [{ role: 'user', content: message } as Message],
    })
    setMessage('')
    textInputRef.current?.blur()
  }

  // ensure conversation is reset
  useEffect(() => {
    dispatch(clearConversation())
    dispatch(createConversation())
  }, [])

  return {
    scrollViewRef,
    textInputRef,
    currentMessages: currentConversation?.messages ?? [],
    message,
    setMessage,
    loading,
    handleSend,
  }
}

export default useViewModel
