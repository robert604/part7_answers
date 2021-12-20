import { login } from '../services/login'
import React, { useState } from 'react'
//import { info, errorInfo } from '../utils/logger'
import blogService from '../services/blogs'
import _ from 'lodash'
import PropTypes from 'prop-types'



const Display = ({ displayState,invert=false,style,children }) => {
  style = style ? style : {}
  if((displayState && invert) || (!displayState && !invert)) style.display='none'

  return (
    <div style={style}>
      {children}
    </div>
  )
}

Display.propTypes = {
  displayState: PropTypes.bool.isRequired,
}

export const Blog = ({ params }) => {
  let { blog,blogs,setBlogs,loggedInUser,setNotificationTemp,likeIt } = params
  const [viewDetails,setViewDetails] = useState(false)
  const isOwner = Boolean(blog.user && loggedInUser && loggedInUser.username===blog.user.username)

  //console.log('making blog',blog,loggedInUser)

  const likeHandler = () => {
    likeIt(blog,blogs,setBlogs)
  }

  const deleteIt = async () => {
    try {
      const confirmed = await window.confirm(`delete blog ${blog.title} by ${blog.author}`)
      if(confirmed) {
        await blogService.deleteBlog(blog,loggedInUser)
        const ind = _.findIndex(blogs,{ id:blog.id })
        blogs = [...blogs]
        blogs.splice(ind,1)
        setBlogs(blogs)
      }
    } catch(error) {
      setNotificationTemp({ text:error.message,isError:true })
    }
  }

  const style = {
    borderStyle:'solid',
    borderWidth:'1px',
    marginBottom:'5px'
  }
  return (
    <div style={style}>
      {blog.title} {blog.author}
      <Display displayState={viewDetails} invert={true} style={{ display:'inline' }} >
        <button onClick={() => setViewDetails(true)}>view</button>
      </Display>
      <Display displayState={viewDetails} invert={false} style={{ display:'inline' }} >
        <button onClick={() => setViewDetails(false)}>hide</button>
      </Display>

      <Display displayState={viewDetails} >
        {blog.url}
        <div>
          likes {blog.likes} <button onClick={likeHandler}>like</button>
        </div>
        <div>
          {blog.user ? blog.user.name : ''}
        </div>
        <Display displayState={isOwner}>
          <button onClick={deleteIt} style={{ background:'lightblue' }}>delete</button>
        </Display>
      </Display>
    </div>
  )
}

export const LoggedOut = ({ params }) => {
  const { usernamePassword, setUsernamePassword, setLoggedInUser, setNotificationTemp } = params
  const usernameChange = event => {
    const up = { ...usernamePassword, username: event.target.value }
    setUsernamePassword(up)
  }
  const passwordChange = event => {
    const up = { ...usernamePassword, password: event.target.value }
    setUsernamePassword(up)
  }
  const loginClick = async event => {
    try {
      event.preventDefault()
      const user = await login(usernamePassword)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setLoggedInUser(user)
      setUsernamePassword({ username: '', password: '' })
      setNotificationTemp({ text: 'Login successful', isError: false })
    } catch (error) {
      if ('response' in error && error.response.status === 401) {
        setNotificationTemp({ text: 'wrong username or password', isError: true })
      } else {
        throw error
      }
    }
  }
  return (
    <form>
      <h2>Login</h2>
      <div>
        Username: <input value={usernamePassword.username} onChange={usernameChange} />
      </div>
      <div>
        Password: <input value={usernamePassword.password} onChange={passwordChange} />
      </div>
      <div>
        <button type='submit' onClick={loginClick}>Login</button>
      </div>
    </form>
  )
}

export const AddBlog = ({ params }) => {
  const { addBlogClick } = params
  const [newBlogInfo, setNewBlogInfo] = useState({ title: '', author: '', url: '' })
  const titleChange = event => {
    const nbi = { ...newBlogInfo, title: event.target.value }
    setNewBlogInfo(nbi)
  }
  const authorChange = event => {
    const nbi = { ...newBlogInfo, author: event.target.value }
    setNewBlogInfo(nbi)
  }
  const urlChange = event => {
    const nbi = { ...newBlogInfo, url: event.target.value }
    setNewBlogInfo(nbi)
  }

  const addBlogHandler = (event) => {
    event.preventDefault()
    console.log('addbloghandler',params)
    addBlogClick({ ...params,newBlogInfo,setNewBlogInfo } )
  }

  return (
    <form id='addBlogForm' onSubmit={addBlogHandler}>
      <h2>add new</h2>
      <div>title <input id='title' value={newBlogInfo.title} onChange={titleChange} /></div>
      <div>author <input id='author' value={newBlogInfo.author} onChange={authorChange} /></div>
      <div>url <input id='url' value={newBlogInfo.url} onChange={urlChange} /></div>
      <button type='submit'>add new blog</button>
    </form>
  )
}

export const LoggedIn = ({ params }) => {
  const { setLoggedInUser, blogs, loggedInUser, setNotificationTemp } = params
  const [blogFormShow,setBlogFormShow] = useState(false)

  blogs.sort((a,b) => a.likes-b.likes)

  const logoutClick = async () => {
    window.localStorage.setItem('loggedInUser', null)
    setLoggedInUser(null)
    setNotificationTemp({ text: 'Logged out', isError: false })
  }

  const likeIt = async (blog,blogs,setBlogs) => {
    const modified = { ...blog }
    modified.likes++
    const updated = await blogService.updateBlog(modified)
    const ind = _.findIndex(blogs,{ id:updated.id })
    blogs = [...blogs]
    blogs.splice(ind,1,updated)
    setBlogs(blogs)
  }

  const addBlogClick = async (params) => {
    const { setBlogs, blogs, loggedInUser, setNotificationTemp,setBlogFormShow,newBlogInfo,setNewBlogInfo } = params

    try {
      const blog = await blogService.addBlog(loggedInUser, newBlogInfo)
      setBlogFormShow(false)
      setBlogs(blogs.concat(blog))
      setNewBlogInfo({ title: '', author: '', url: '' })
      setNotificationTemp({ text: `added blog ${blog.title} by ${blog.author}`, isError: false })
    } catch (error) {
      setNotificationTemp({ text: JSON.stringify(error.message), isError: true })
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {`${loggedInUser.name} logged in `}
        <button onClick={logoutClick}>Log out</button>
      </div>
      <Display displayState={blogFormShow}>
        <AddBlog params={{ ...params,setBlogFormShow,addBlogClick }}/>
        <button onClick={() => setBlogFormShow(false)}>CANCEL</button>
      </Display>
      <Display displayState={blogFormShow} invert={true}>
        <button onClick={() => setBlogFormShow(true)}>Create New Blog</button>
      </Display>
      {blogs.map(blog =>
        <Blog key={blog.id} params={{ ...params,blog:blog,likeIt:likeIt }}/>
      )}
    </div>
  )
}

export const Notification = ({ notification }) => {
  if (!notification) return null
  const { text, isError } = notification
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

