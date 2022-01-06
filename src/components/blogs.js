import React, { useState } from 'react'
import { deleteBlog,likeBlog } from '../reducers/blogsReducer'
import { useDispatch,useSelector } from 'react-redux'
import { Display } from './comps'
import { Link,useParams } from 'react-router-dom'

export const Blogs = () => {
  const credentials = useSelector(store => store.credentials)
  const loggedInUser = credentials.user
  const blogs = useSelector(store => store.blogs)
  blogs.sort((a,b) => b.likes-a.likes)
  if(loggedInUser) {
    return(
      <div>
        { blogs.map(blog => <BlogLink key={blog.id} params={{ blog:blog }}/>) }
      </div>
    )
  }
  return null
}

export const BlogDetails = ({ params }) => {
  const dispatch = useDispatch()
  let { blog } = params
  const [viewDetails,setViewDetails] = useState(false)
  const loggedInUser = useSelector(store => store.credentials).user

  const isOwner = Boolean(blog.user && loggedInUser && loggedInUser.username===blog.user.username)

  const likeHandler = () => {
    dispatch(likeBlog(blog))
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
  if(loggedInUser) {
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
  return null
}

export const BlogView = () => {
  const dispatch = useDispatch()
  const blogId = useParams().id
  const loggedInUser = useSelector(store => store.credentials).user
  const blogs = useSelector(store => store.blogs)
  const blog = blogs.find(blog => blog.id===blogId)
  if(loggedInUser && blog) {
    return(
      <div>
        <h2>{blog.title}</h2>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>{blog.likes} likes <button id='like' onClick={() => dispatch(likeBlog(blog))}>like</button></div>
        <div>added by {blog.user.name}</div>
        <h4>comments</h4>
        <ul>
          {blog.comments.map((comment,index) => <li key={index}>{comment}</li>)}
        </ul>
      </div>
    )
  }
  return null
}

export const BlogLink = ({ params }) => {

  let { blog } = params

  const loggedInUser = useSelector(store => store.credentials).user

  const style = {
    borderStyle:'solid',
    borderWidth:'1px',
    marginBottom:'5px'
  }
  if(loggedInUser) {
    return (
      <div className='blog' style={style}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </div>
    )
  }
  return null
}