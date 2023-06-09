
import blogService from '../services/blogs'
import { createSlice } from '@reduxjs/toolkit'
import { initializeMessage } from './notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlogs(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },
    updateBlog(state, action) {
      const id = action.payload.id
      const userInfo = state.find(blog => blog.id === id)
      return state.map(blog => blog.id !== id ? blog : { ...action.payload, user: userInfo.user })
    }
  }
})

export const { setBlogs, appendBlogs, removeBlog, updateBlog } = blogsSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogsDB = await blogService.getAll()
    dispatch(setBlogs(blogsDB))
  }
}

export const initializeNew = (newBlog, userData) => {
  return async dispatch => {
    const blogResponse = await blogService.create(newBlog)
    blogResponse.user = { ...userData, id: blogResponse.user }
    dispatch(appendBlogs(blogResponse))
    dispatch(initializeMessage(`new blog '${newBlog.title}' by ${newBlog.author} added`))
  }
}

export const initializeRemove = (blog) => {
  return async dispatch => {
    await blogService.deleteBlog(blog.id)
    dispatch(removeBlog(blog.id))
    dispatch(initializeMessage(`Blog '${blog.title}' was successfully deleted`))
  }
}

export const initializeLike = (blog) => {
  return async dispatch => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const response = await blogService.likesIncrease(blog.id, updatedBlog)
    dispatch(updateBlog(response))
  }
}

export default blogsSlice.reducer











