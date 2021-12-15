import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import {login} from './services/login'
import {info} from './utils/logger'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [usernamePassword, setUsernamePassword] = useState({username:'',password:''})
  const [loggedInUser,setLoggedInUser] = useState(null)
  const [newBlogInfo,setNewBlogInfo] = useState({title:'',author:'',url:''})

  useEffect(() => {
    let user = window.localStorage.getItem('loggedInUser')
    if(user) user = JSON.parse(user)
    setLoggedInUser(user)
    blogService.getAll().then(blogs => {
        info('blogs',blogs)
        setBlogs( blogs )
      }
    )  
  }, [])

  const usernameChange = event=>{
    const up = {...usernamePassword,username:event.target.value}
    setUsernamePassword(up)
  }
  const passwordChange = event=>{
    const up = {...usernamePassword,password:event.target.value}
    setUsernamePassword(up)
  }

  const titleChange = event=>{
    const nbi = {...newBlogInfo,title:event.target.value}
    setNewBlogInfo(nbi)
  }
  const authorChange = event=>{
    const nbi = {...newBlogInfo,author:event.target.value}
    setNewBlogInfo(nbi)
  }
  const urlChange = event=>{
    const nbi = {...newBlogInfo,url:event.target.value}
    setNewBlogInfo(nbi)
  }

  const loginClick = async event=>{
    event.preventDefault()
    info('logging in',usernamePassword)
    const user = await login(usernamePassword)
    info('login resp',user)
    window.localStorage.setItem('loggedInUser',JSON.stringify(user))
    setLoggedInUser(user)
    setUsernamePassword({username:'',password:''})    
  }

  const logoutClick = async event=>{
    window.localStorage.setItem('loggedInUser',null)
    setLoggedInUser(null)
    info('logged out')
  }

  const addBlogClick = async event=>{
    const blog = await blogService.addBlog(loggedInUser,newBlogInfo)
    setBlogs(blogs.concat(blog))
  }

  const loggedOut = ()=>{
    return (
      <form>
        <h2>Login</h2>
        <div>
          Username: <input value={usernamePassword.username} onChange={usernameChange}/>
        </div>
        <div>
          Password: <input value={usernamePassword.password} onChange={passwordChange}/>
        </div>
        <div>
          <button type='submit' onClick={loginClick}>Login</button>
        </div>
      </form>
    )
  }

  const loggedIn = ()=>{
    return (
      <div>
        <div>
          {`${loggedInUser.name} logged in `}
          <button onClick={logoutClick}>Log out</button>
        </div>
        <form>
          <h2>add new</h2>
          <div>title <input value={newBlogInfo.title} onChange={titleChange}/></div>
          <div>author <input value={newBlogInfo.author} onChange={authorChange}/></div>
          <div>url <input value={newBlogInfo.url} onChange={urlChange}/></div>
          <button onClick={addBlogClick}>add new blog</button>                  
        </form>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    loggedInUser ? loggedIn() : loggedOut()
  )
}

export default App