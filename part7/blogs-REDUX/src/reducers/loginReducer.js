
import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { initializeMessage } from './notificationReducer'


const loginSlice = createSlice({
  name: 'login',
  initialState: {
    username: '',
    password: '',
    user: null
  },
  reducers: {
    setUsername(state, action) {
      return { ...state, username: action.payload }
    },
    setPassword(state, action) {
      return { ...state, password: action.payload }
    },
    setUser(state, action) {
      return { ...state, user: action.payload }
    }
  }
})


export const { setUsername, setPassword, setUser } = loginSlice.actions

export const loginFromStorage = (user) => {
  return dispatch => {
    dispatch(setUser(user))
    blogService.setToken(user.token)
  }
}

export const loginFromForm = (credentials) => {
  return async dispatch => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(
        'loggedBlogsappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
    } catch (exception) {
      dispatch(initializeMessage(exception.response.data['error'], 'error'))
    }
  }
}

export const loginLogout = () => {
  return dispatch => {
    dispatch(setUsername(''))
    dispatch(setPassword(''))
    dispatch(setUser(null))
  }
}

export default loginSlice.reducer






