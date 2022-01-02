import { login } from '../services/login'
import React, { useState } from 'react'
//import { info, errorInfo } from '../utils/logger'
import blogService from '../services/blogs'
//import _ from 'lodash'
import PropTypes from 'prop-types'
import { blogsStore,updateBlog,deleteBlog,addBlog } from '../reducers/blogsReducer'
import { credentialsStore, setCredentials, setUser } from '../reducers/credentialsReducer'
import { notificationStore,startNotification } from '../reducers/notificationReducer'




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
  let { blog,
    likeIt } = params
  const [viewDetails,setViewDetails] = useState(false)

  const loggedInUser = credentialsStore.getState().user

  const isOwner = Boolean(blog.user && loggedInUser && loggedInUser.username===blog.user.username)

  //console.log('making blog',blog,loggedInUser)

  const likeHandler = () => {
    likeIt(blog)
  }

  const deleteIt = async () => {
    try {
      const confirmed = await window.confirm(`delete blog ${blog.title} by ${blog.author}`)
      if(confirmed) {
        await blogService.deleteBlog(blog,loggedInUser)
        blogsStore.dispatch(deleteBlog(blog))
        //const ind = _.findIndex(blogs,{ id:blog.id })
        //blogs = [...blogs]
        //blogs.splice(ind,1)
        //setBlogs(blogs)
      }
    } catch(error) {
      startNotification({ text:error.message,isError:true })
    }
  }

  const style = {
    borderStyle:'solid',
    borderWidth:'1px',
    marginBottom:'5px'
  }
  return (
    <div className='blog' style={style}>
      {blog.title} {blog.author}
      <Display displayState={viewDetails} invert={true} style={{ display:'inline' }} >
        <button id='view' onClick={() => setViewDetails(true)}>view</button>
      </Display>
      <Display displayState={viewDetails} invert={false} style={{ display:'inline' }} >
        <button id='hide' onClick={() => setViewDetails(false)}>hide</button>
      </Display>

      <Display displayState={viewDetails} >
        {blog.url}
        <div className='likesDiv'>
          likes {blog.likes} <button id='like' onClick={likeHandler}>like</button>
        </div>
        <div>
          {blog.user ? blog.user.name : ''}
        </div>
        <Display displayState={isOwner}>
          <button id='delete' onClick={deleteIt} style={{ background:'lightblue' }}>delete</button>
        </Display>
      </Display>
    </div>
  )
}

export const LoggedOut = () => {
  const credentials = credentialsStore.getState()
  const usernameChange = event => {
    const up = { ...credentials, username: event.target.value }
    credentialsStore.dispatch(setCredentials(up))
  }
  const passwordChange = event => {
    const up = { ...credentials, password: event.target.value }
    credentialsStore.dispatch(setCredentials(up))
  }
  const loginClick = async event => {
    try {
      event.preventDefault()
      const user = await login(credentials)
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      credentialsStore.dispatch(setUser(user))
      credentialsStore.dispatch(setCredentials({ username: '', password: '' }))
      startNotification({ text: 'Login successful', isError: false })
    } catch (error) {
      if ('response' in error && error.response.status === 401) {
        startNotification({ text: 'wrong username or password', isError: true })
      } else {
        throw error
      }
    }
  }
  return (
    <form>
      <h2>Login</h2>
      <div>
        Username: <input id='username' value={credentials.username} onChange={usernameChange} />
      </div>
      <div>
        Password: <input id='password' value={credentials.password} onChange={passwordChange} />
      </div>
      <div>
        <button id='login-button' type='submit' onClick={loginClick}>Login</button>
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
    addBlogClick({ ...params,newBlogInfo,setNewBlogInfo } )

  }

  return (
    <form id='addBlogForm' onSubmit={addBlogHandler}>
      <h2>add new</h2>
      <div>title <input id='title' value={newBlogInfo.title} onChange={titleChange} /></div>
      <div>author <input id='author' value={newBlogInfo.author} onChange={authorChange} /></div>
      <div>url <input id='url' value={newBlogInfo.url} onChange={urlChange} /></div>
      <button id='addnewblog' type='submit'>add new blog</button>
    </form>
  )
}

export const LoggedIn = () => {
  const [blogFormShow,setBlogFormShow] = useState(false)

  const loggedInUser = credentialsStore.getState().user
  const blogs = blogsStore.getState()
  blogs.sort((a,b) => b.likes-a.likes)

  const logoutClick = async () => {
    window.localStorage.setItem('loggedInUser', null)
    credentialsStore.dispatch(setUser(null))
    startNotification({ text: 'Logged out', isError: false })
  }

  const likeIt = async (blog) => {
    const modified = { ...blog }
    modified.likes++
    const updated = await blogService.updateBlog(modified)
    blogsStore.dispatch(updateBlog(updated))
    //const ind = _.findIndex(blogs,{ id:updated.id })
    //blogs = [...blogs]
    //blogs.splice(ind,1,updated)
    //setBlogs(blogs)
  }

  const addBlogClick = async (params) => {
    const { setBlogFormShow,newBlogInfo,setNewBlogInfo } = params

    try {
      const blog = await blogService.addBlog(loggedInUser, newBlogInfo)
      setBlogFormShow(false)
      blogsStore.dispatch(addBlog(blog))
      setNewBlogInfo({ title: '', author: '', url: '' })
      startNotification({ text: `added blog ${blog.title} by ${blog.author}`, isError: false })
    } catch (error) {
      startNotification({ text: JSON.stringify(error.message), isError: true })
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {`${loggedInUser.name} logged in `}
        <button onClick={logoutClick}>Log out</button>
      </div>
      <Display displayState={blogFormShow}>
        <AddBlog params={{ setBlogFormShow,addBlogClick }}/>
        <button onClick={() => setBlogFormShow(false)}>CANCEL</button>
      </Display>
      <Display displayState={blogFormShow} invert={true}>
        <button id='createnewblog' onClick={() => setBlogFormShow(true)}>Create New Blog</button>
      </Display>
      {blogs.map(blog =>
        <Blog key={blog.id} params={{ blog:blog,likeIt:likeIt }}/>
      )}
    </div>
  )
}

export const Notification = () => {
  const notification = notificationStore.getState()
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
  return <div id='notification' style={style}>{text}</div>
}

