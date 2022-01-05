import React, { useState } from 'react'
//import { Users } from './users'
import { startNotification } from '../reducers/notificationReducer'
import { addBlog } from '../reducers/blogsReducer'
import { setUser } from '../reducers/credentialsReducer'
import { useDispatch,useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
//<Link to='/'>blogs</Link>
//<Link to='/users'>users</Link>
/*
<div style={{ marginBottom: '20px' }}>
{`${loggedInUser.name} logged in `}
<button onClick={logoutClick}>Log out</button>
</div>
*/
export const LoggedIn = () => {
  const dispatch = useDispatch()
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user

  const logoutClick = async () => {
    window.localStorage.setItem('loggedInUser', null)
    dispatch(setUser(null))
    dispatch(startNotification({ text: 'Logged out', isError: false }))
  }

  const hspace = {
    padding: '2px'
  }
  if(loggedInUser) {
    return (
      <div>
        <div style={{ marginBottom: '20px', backgroundColor:'lightGrey' }}>
          <Link style={hspace} to={'/'}>blogs</Link>
          <Link style={hspace} to='/users'>users</Link>
          <span style={hspace}>{`${loggedInUser.name} logged in `}</span>
          <button style={hspace} onClick={logoutClick}>Log out</button>
        </div>
      </div>
    )
  }
  return null
}

export const AddBlog = () => {
  const dispatch = useDispatch()
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user
  const [showForm,setShowForm] = useState(false)
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
  const addBlogClick = async () => {

    dispatch(addBlog(loggedInUser, newBlogInfo))
    setShowForm(false)
    setNewBlogInfo({ title: '', author: '', url: '' })

  }
  const addBlogHandler = (event) => {
    event.preventDefault()
    addBlogClick()

  }
  if(loggedInUser) {
    if(showForm) {
      return (
        <div>
          <form id='addBlogForm' onSubmit={addBlogHandler}>
            <h2>add new</h2>
            <div>title <input id='title' value={newBlogInfo.title} onChange={titleChange} /></div>
            <div>author <input id='author' value={newBlogInfo.author} onChange={authorChange} /></div>
            <div>url <input id='url' value={newBlogInfo.url} onChange={urlChange} /></div>
            <button id='addnewblog' type='submit'>add new blog</button>
          </form>
          <button onClick={() => setShowForm(false)}>CANCEL</button>
        </div>
      )
    } else {
      return(
        <button id='createnewblog' onClick={() => setShowForm(true)}>Create New Blog</button>
      )
    }
  }
  return null
}