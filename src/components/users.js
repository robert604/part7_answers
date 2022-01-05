import _ from 'lodash'
import { useSelector } from 'react-redux'
import React from 'react'
import {
  Link,
  useParams
} from 'react-router-dom'

export const Users = () => {
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user
  const blogs = useSelector(store => store.blogs)
  const blogGroups = _.groupBy(blogs,(blog) => blog.user.id)
  const users = Object.values(blogGroups).map(blogGroup => {
    const firstBlog = blogGroup[0]
    return {
      id: firstBlog.user.id,
      name: firstBlog.user.name,
      count: blogGroup.length
    }
  })
  if(loggedInUser) {
    return(
      <div>
        <h2>Users</h2>
        <h3>Blogs created</h3>

        {
          users.map(user => {
            return(
              <div key={user.id}>
                <Link to={`/users/${user.id}`}>{user.name}</Link> {user.count}
              </div>
            )
          })
        }

      </div>
    )
  }
  return null
}

export const User = () => {
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user
  const blogs = useSelector(store => store.blogs)
  const blogGroups = _.groupBy(blogs,(blog) => blog.user.id)
  const userId = useParams().id

  const userBlogs = blogGroups[userId]
  if(loggedInUser) {
    if(userBlogs) {
      const name = userBlogs[0].user.name
      return(
        <div>
          <h2>{name}</h2>
          <h3>added blogs</h3>
          <ul>
            {
              userBlogs.map(blog => {
                return(
                  <li key={blog.id}>{blog.title}</li>
                )
              })
            }
          </ul>
        </div>
      )
    }
  }
  return null
}