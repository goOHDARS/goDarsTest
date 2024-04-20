import { store } from './src/store'
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import Root from './src/Root'

export default function App() {
  return (
    <Provider store={store}>
      <AutocompleteDropdownContextProvider>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </AutocompleteDropdownContextProvider>
    </Provider>
  )
}
