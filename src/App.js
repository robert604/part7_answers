import React, { useEffect } from 'react'
import blogService from './services/blogs'
//import {info} from './utils/logger'
import { LoggedIn,LoggedOut, Notification } from './components/comps'
import { initBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/credentialsReducer'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user

  useEffect(() => {
    let user = window.localStorage.getItem('loggedInUser')
    if(user) user = JSON.parse(user)
    dispatch(setUser(user))
    blogService.getAll().then(blogs => {
      dispatch(initBlogs(blogs))
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