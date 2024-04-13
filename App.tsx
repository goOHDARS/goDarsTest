import { store } from './src/store'
import { Provider } from 'react-redux'
import Root from './src/Root'

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}
