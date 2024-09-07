import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

export const getKey = async (key: string) =>
  ReactNativeAsyncStorage.getItem(key)

export const removeKey = async (key: string) =>
  ReactNativeAsyncStorage.removeItem(key)

export const setKey = async (key: string, value?: string) =>
  ReactNativeAsyncStorage.setItem(key, value ?? 'true')
