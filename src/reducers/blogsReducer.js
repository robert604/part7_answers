import _ from 'lodash'
import blogService from '../services/blogs'
import { startNotification } from './notificationReducer'

export const blogsReducer = (blogs=[],action) => {
  let ind
  let replaceWith
  switch(action.type) {
  case 'DELETEBLOG':
    ind = _.findIndex(blogs,{ id:action.deletedBlog.id })
    blogs = [...blogs]
    blogs.splice(ind,1)
    return blogs
  case 'LIKEBLOG':
    ind = _.findIndex(blogs,{ id:action.likedBlog.id })
    blogs = [...blogs]
    replaceWith = { ...blogs[ind],likes:action.likedBlog.likes }
    blogs.splice(ind,1,replaceWith)
    return blogs
  case 'ADDBLOG':
    blogs = blogs.concat(action.newBlog)
    return blogs
  case 'INITBLOGS':
    blogs = action.blogs
    return blogs
  }

  return blogs
}

export const deleteBlog = (blog,loggedInUser) => {
  return async dispatch => {
    try {
      await blogService.deleteBlog(blog,loggedInUser)
      dispatch({
        type: 'DELETEBLOG',
        deletedBlog: blog
      })
    } catch(error) {
      dispatch(startNotification({ text:error.message,isError:true }))
    }
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const modified = { ...blog }
    modified.likes++
    const updated = await blogService.updateBlog(modified)
    dispatch({
      type: 'LIKEBLOG',
      likedBlog: updated
    })
  }
}

export const addBlog = (loggedInUser, newBlogInfo) => {
  return async dispatch => {
    try {
      const blog = await blogService.addBlog(loggedInUser, newBlogInfo)
      dispatch(startNotification({ text: `added blog ${blog.title} by ${blog.author}`, isError: false }))
      dispatch({
        type: 'ADDBLOG',
        newBlog: blog
      })
    } catch(error) {
      dispatch(startNotification({ text: JSON.stringify(error.message), isError: true }))
    }
  }
}

export const initBlogs = blogs => {
  return {
    type: 'INITBLOGS',
    blogs: blogs
  }
}


