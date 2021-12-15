import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import {login} from './services/login'
import {info} from './utils/logger'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [{username,password}, setUsernamePassword] = useState({username:'',password:''})
  const [loggedInUser,setLoggedInUser] = useState(null)

  useEffect(() => {
    let user = window.localStorage.getItem('loggedInUser')
    if(user) user = JSON.parse(user)
    setLoggedInUser(user)
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const usernameChange = event=>{
    setUsernamePassword({username:event.target.value,password:password})
  }
  const passwordChange = event=>{
    setUsernamePassword({username:username,password:event.target.value})
  }

  const loginClick = async event=>{
    event.preventDefault()
    info('logging in',username,password)
    const user = await login({username,password})
    info('login resp',user)
    window.localStorage.setItem('loggedInUser',JSON.stringify(user))
    setLoggedInUser(user)
  }

  const loginForm = ()=>{
    return (
      <form>
        <h2>Login</h2>
        <div>
          Username: <input value={username} onChange={usernameChange}/>
        </div>
        <div>
          Password: <input value={password} onChange={passwordChange}/>
        </div>
        <div>
          <button type='submit' onClick={loginClick}>Login</button>
        </div>
      </form>
    )
  }

  const loggedIn = ()=>{
    return (
      <div>{`${loggedInUser.name} logged in`}</div>
    )
  }

  return (
    loggedInUser ? 
    <div>
      {loggedIn()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
    : loginForm()
  )
}

export default App