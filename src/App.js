import React, { useState, useEffect } from 'react'
import blogService from './services/blogs'
//import {info} from './utils/logger'
import { LoggedIn,LoggedOut, Notification } from './components/comps'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [usernamePassword, setUsernamePassword] = useState({ username:'',password:'' })
  const [loggedInUser,setLoggedInUser] = useState(null)
  const [notification,setNotification] = useState(null)

  const setNotificationTemp = notification => {
    setNotification(notification)
    setTimeout(() => setNotification(null),5000)
  }

  const uiParams = {
    blogs,setBlogs,
    usernamePassword,setUsernamePassword,
    loggedInUser,setLoggedInUser,
    notification,setNotification,setNotificationTemp,
  }


  useEffect(() => {
    let user = window.localStorage.getItem('loggedInUser')
    if(user) user = JSON.parse(user)
    setLoggedInUser(user)
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
    })
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      {loggedInUser ? <LoggedIn params={uiParams}/> : <LoggedOut params={uiParams}/>}
    </div>
  )
}

export default App