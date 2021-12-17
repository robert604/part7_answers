import { login } from '../services/login'
import React, { useState, useRef, useImperativeHandle } from 'react'
//import { info, errorInfo } from '../utils/logger'
import blogService from '../services/blogs'

const Toggleable = React.forwardRef(( props, ref ) => {
  const { buttonLabel, initialVisibility, children} = props
  const [visibility, setVisibility] = useState(initialVisibility)
  const childrenStyle = { display: visibility ? '' : 'none' }
  const buttonStyle = { display: visibility ? 'none' : '' }

  const makeVisible = () => setVisibility(true)
  const makeInvisible = () => setVisibility(false)
  const setCompVisibility = (v) => {
    setVisibility(v)
  }

  useImperativeHandle(ref,() => {
    return {
      setCompVisibility
    }
  })

  return (
    <div>
      <div style={childrenStyle}>
        {children}
      </div>
      <div style={buttonStyle}>
        <button onClick={makeVisible}>{buttonLabel}</button>
      </div>
      <div style={childrenStyle}>
        <button onClick={makeInvisible}>Cancel</button>
      </div>
    </div>
  )
})

const Blog = ({ blog }) => {
  return (
    <div>
      {blog.title} {blog.author}
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

const AddBlog = ({ params }) => {
  const { setBlogs, blogs, loggedInUser, setNotificationTemp, newBlogFormRef } = params
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
  const addBlogClick = async event => {
    event.preventDefault()
    try {
      const blog = await blogService.addBlog(loggedInUser, newBlogInfo)
      newBlogFormRef.current.setCompVisibility(false)
      setBlogs(blogs.concat(blog))
      setNewBlogInfo({ title: '', author: '', url: '' })
      setNotificationTemp({ text: `added blog ${blog.title} by ${blog.author}`, isError: false })
    } catch (error) {
      setNotificationTemp({ text: JSON.stringify(error.message), isError: true })
    }
  }
  return (
    <form>
      <h2>add new</h2>
      <div>title <input value={newBlogInfo.title} onChange={titleChange} /></div>
      <div>author <input value={newBlogInfo.author} onChange={authorChange} /></div>
      <div>url <input value={newBlogInfo.url} onChange={urlChange} /></div>
      <button onClick={addBlogClick}>add new blog</button>
    </form>
  )
}

export const LoggedIn = ({ params }) => {
  const { setLoggedInUser, blogs, loggedInUser, setNotificationTemp } = params

  const logoutClick = async event => {
    window.localStorage.setItem('loggedInUser', null)
    setLoggedInUser(null)
    setNotificationTemp({ text: 'Logged out', isError: false })
  }

  const newBlogFormRef = useRef()

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        {`${loggedInUser.name} logged in `}
        <button onClick={logoutClick}>Log out</button>
      </div>
      <Toggleable buttonLabel='Create new blog' initialVisibility={false} ref={newBlogFormRef}>

        <AddBlog params={{ ...params, newBlogFormRef }} />
      </Toggleable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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

