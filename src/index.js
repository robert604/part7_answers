import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { blogsStore } from './reducers/blogsReducer'
import { credentialsStore } from './reducers/credentialsReducer'
import { notificationStore } from './reducers/notificationReducer'

const renderApp = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
blogsStore.subscribe(renderApp)
credentialsStore.subscribe(renderApp)
notificationStore.subscribe(renderApp)