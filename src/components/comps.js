//import { login } from '../services/login'
import React, { useState } from 'react'
//import { info, errorInfo } from '../utils/logger'
//import blogService from '../services/blogs'
//import _ from 'lodash'
import PropTypes from 'prop-types'
import { likeBlog,deleteBlog,addBlog } from '../reducers/blogsReducer'
import { setCredentials, setUser, loginUser } from '../reducers/credentialsReducer'
import { startNotification } from '../reducers/notificationReducer'
import { useDispatch,useSelector } from 'react-redux'



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
  const dispatch = useDispatch()
  let { blog,
    likeIt } = params
  const [viewDetails,setViewDetails] = useState(false)
  const loggedInUser = useSelector(store => store.credentials).user

  const isOwner = Boolean(blog.user && loggedInUser && loggedInUser.username===blog.user.username)

  //console.log('making blog',blog,loggedInUser)

  const likeHandler = () => {
    likeIt(blog)
  }

  const deleteIt = async () => {
    const confirmed = await window.confirm(`delete blog ${blog.title} by ${blog.author}`)
    if(confirmed) {
      dispatch(deleteBlog(blog,loggedInUser))
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
  const dispatch = useDispatch()
  const credentials = useSelector(store => store.credentials)
  const usernameChange = event => {
    const up = { ...credentials, username: event.target.value }
    dispatch(setCredentials(up))
  }
  const passwordChange = event => {
    const up = { ...credentials, password: event.target.value }
    dispatch(setCredentials(up))
  }
  const loginClick = async event => {
    event.preventDefault()
    dispatch(loginUser(credentials))
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
  const dispatch = useDispatch()
  const [blogFormShow,setBlogFormShow] = useState(false)
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user
  const blogs = useSelector(store => store.blogs)
  blogs.sort((a,b) => b.likes-a.likes)

  const logoutClick = async () => {
    window.localStorage.setItem('loggedInUser', null)
    dispatch(setUser(null))
    dispatch(startNotification({ text: 'Logged out', isError: false }))
  }

  const likeIt = (blog) => {
    dispatch(likeBlog(blog))

  }

  const addBlogClick = async (params) => {
    const { newBlogInfo,setNewBlogInfo } = params
    dispatch(addBlog(loggedInUser, newBlogInfo))
    setBlogFormShow(false)
    setNewBlogInfo({ title: '', author: '', url: '' })

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
  const notification = useSelector(store => store.notification)
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

