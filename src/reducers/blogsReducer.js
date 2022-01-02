import _ from 'lodash'
import { createStore } from 'redux'

const blogsReducer = (blogs=[],action) => {
  let ind
  switch(action.type) {
  case 'DELETEBLOG':
    ind = _.findIndex(blogs,{ id:action.deletedBlog.id })
    blogs = [...blogs]
    blogs.splice(ind,1)
    return blogs
  case 'UPDATEBLOG':
    ind = _.findIndex(blogs,{ id:action.updatedBlog.id })
    blogs = [...blogs]
    blogs.splice(ind,1,action.updatedBlog)
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

export const deleteBlog = deletedBlog => {
  return {
    type: 'DELETEBLOG',
    deletedBlog: deletedBlog
  }
}

export const updateBlog = updatedBlog => {
  return {
    type: 'UPDATEBLOG',
    updatedBlog: updatedBlog
  }
}

export const addBlog = newBlog => {
  return {
    type: 'ADDBLOG',
    newBlog: newBlog
  }
}

export const initBlogs = blogs => {
  return {
    type: 'INITBLOGS',
    blogs: blogs
  }
}

export const blogsStore = createStore(blogsReducer)

