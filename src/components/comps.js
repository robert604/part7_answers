import {login} from '../services/login'
import React from 'react'
import {info,errorInfo} from '../utils/logger'
import blogService from '../services/blogs'

const Blog = ({blog}) => (
  <div>
    {blog.title} {blog.author}
  </div>  
)

export const LoggedOut = ({params})=>{
  const {usernamePassword, setUsernamePassword,setLoggedInUser,setNotificationTemp} = params
  const usernameChange = event=>{
    const up = {...usernamePassword,username:event.target.value}
    setUsernamePassword(up)
  }
  const passwordChange = event=>{
    const up = {...usernamePassword,password:event.target.value}
    setUsernamePassword(up)
  }  
  const loginClick = async event=>{
    try {
      event.preventDefault()
      const user = await login(usernamePassword)
      window.localStorage.setItem('loggedInUser',JSON.stringify(user))
      setLoggedInUser(user)
      setUsernamePassword({username:'',password:''}) 
      setNotificationTemp({text:'Login successful',isError:false})
    } catch(error) {
      if('response' in error && error.response.status===401) {
        setNotificationTemp({text:'wrong username or password',isError:true})
      } else {
        throw error
      }
    }  
  }
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

export const LoggedIn = ({params})=>{
  const {setNewBlogInfo,setLoggedInUser,setBlogs,blogs,newBlogInfo,loggedInUser,setNotificationTemp} = params
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
  const logoutClick = async event=>{
    window.localStorage.setItem('loggedInUser',null)
    setLoggedInUser(null)
    setNotificationTemp({text:'Logged out',isError:false})    
  }

  const addBlogClick = async event=>{
    event.preventDefault()
    try {
      const blog = await blogService.addBlog(loggedInUser,newBlogInfo)
      setBlogs(blogs.concat(blog))
      setNotificationTemp({text:`added blog ${blog.title} by ${blog.author}`,isError:false})
    } catch(error) {
      setNotificationTemp({text:JSON.stringify(error.message),isError:true})  
    }
  }

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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export const Notification = ({notification})=>{
  if(!notification) return null  
  const {text,isError} = notification
  const style = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: '5px',
    marginBottom: '10px',
    padding: '10px',
    fontSize: '20px'
  }
  return <div style={style}>{text}</div>
}