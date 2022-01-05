
import React, { useEffect } from 'react'
import blogService from './services/blogs'
//import {info} from './utils/logger'
import { LoggedOut, Notification } from './components/comps'
import { LoggedIn,AddBlog } from './components/logged-in'
import { initBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/credentialsReducer'
import { useDispatch } from 'react-redux'
import { Users,User } from './components/users'
import { Blogs,BlogView } from './components/blogs'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'




const App = () => {
  const dispatch = useDispatch()
  //const credentials = useSelector(store => store.credentials)
  //const loggedInUser = credentials.user

  useEffect(() => {
    let user = window.localStorage.getItem('loggedInUser')
    if(user) user = JSON.parse(user)
    dispatch(setUser(user))
    blogService.getAll().then(blogs => {
      dispatch(initBlogs(blogs))
    })
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      <LoggedIn />
      <LoggedOut />

      <Router>
        <Routes>
          <Route path='/' element={
            <div>
              <AddBlog />
              <Blogs />
            </div>
          }/>
          <Route path='/users' element={ <Users /> }/>
          <Route path='/users/:id' element={ <User/> }/>
          <Route path='/blogs/:id' element={ <BlogView/> }/>
        </Routes>
      </Router>
    </div>
  )
}

export default App