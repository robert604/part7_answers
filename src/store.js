import { createStore, combineReducers } from 'redux'
import { credentialsReducer } from './reducers/credentialsReducer'
import { blogsReducer } from './reducers/blogsReducer'
import thunk from 'redux-thunk'
import { notificationReducer } from './reducers/notificationReducer'
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  credentials: credentialsReducer,
  blogs: blogsReducer,
  notification: notificationReducer
})

const store = createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))

export default store