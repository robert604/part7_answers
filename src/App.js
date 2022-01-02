import React, { useEffect } from 'react'
import blogService from './services/blogs'
//import {info} from './utils/logger'
import { LoggedIn,LoggedOut, Notification } from './components/comps'
import { blogsStore,initBlogs } from './reducers/blogsReducer'
import { credentialsStore,setUser } from './reducers/credentialsReducer'

const App = () => {

  const loggedInUser = credentialsStore.getState().user

  useEffect(() => {
    let user = window.localStorage.getItem('loggedInUser')
    if(user) user = JSON.parse(user)
    credentialsStore.dispatch(setUser(user))
    blogService.getAll().then(blogs => {
      blogsStore.dispatch(initBlogs(blogs))
    })
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      {loggedInUser ? <LoggedIn /> : <LoggedOut/>}
    </div>
  )
}

export default App