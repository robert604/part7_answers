import React, { useState } from 'react'
//import { Users } from './users'
import { startNotification } from '../reducers/notificationReducer'
import { addBlog } from '../reducers/blogsReducer'
import { setUser } from '../reducers/credentialsReducer'
import { useDispatch,useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'

export const LoggedIn = () => {
  const dispatch = useDispatch()
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user

  const logoutClick = async () => {
    window.localStorage.setItem('loggedInUser', null)
    dispatch(setUser(null))
    dispatch(startNotification({ text: 'Logged out', isError: false }))
  }


  if(loggedInUser) {
    const hspace = {
      padding: '2px'
    }
    /*return (
      <div>
        <div style={{ marginBottom: '20px', backgroundColor:'lightGrey' }}>
          <Link style={hspace} to={'/'}>blogs</Link>
          <Link style={hspace} to='/users'>users</Link>
          <span style={hspace}>{`${loggedInUser.name} logged in `}</span>
          <button style={hspace} onClick={logoutClick}>Log out</button>
        </div>
      </div>
    )*/
    return(
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#' as='span'>
              <Link style={hspace} to={'/'}>blogs</Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <Link style={hspace} to='/users'>users</Link>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <span style={hspace}>{`${loggedInUser.name} logged in `}</span>
            </Nav.Link>
            <Nav.Link href='#' as='span'>
              <button style={hspace} onClick={logoutClick}>Log out</button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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