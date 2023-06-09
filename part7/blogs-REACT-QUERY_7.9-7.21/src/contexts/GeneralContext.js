import { createContext, useReducer, useContext } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'RESET':
      return null
    default:
      return state
  }
}

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_USERNAME':
      return { ...state, username: action.payload }
    case 'SET_PASSWORD':
      return { ...state, password: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    default:
      return state
  }
}

const NotificationContext = createContext()
const UserContext = createContext()

const ContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )
  const [user, userDispatch] = useReducer(userReducer, {
    user: null,
    username: '',
    password: '',
  })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <UserContext.Provider value={[user, userDispatch]}>
        {props.children}
      </UserContext.Provider>
    </NotificationContext.Provider>
  )
}

export const useUserValue = () => {
  const [user] = useContext(UserContext)
  return user
}

export const useUserDispatch = () => {
  const valueAndDispatch = useContext(UserContext)
  return valueAndDispatch[1]
}

export const useLogout = () => {
  const dispatch = useUserDispatch()
  return () => {
    window.localStorage.clear()
    dispatch({ type: 'LOGOUT' })
  }
}

export const useUserLogin = () => {
  const [user, userDispatch] = useContext(UserContext)
  const useNotify = useNotificationDispatch()
  return async () => {
    try {
      const userData = await loginService.login({
        username: user.username,
        password: user.password,
      })
      window.localStorage.setItem(
        'loggedBlogsappUser',
        JSON.stringify(userData)
      )

      blogService.setToken(userData.token)
      userDispatch({ type: 'SET_USER', payload: userData })
      userDispatch({ type: 'SET_USERNAME', payload: '' })
      userDispatch({ type: 'SET_PASSWORD', payload: '' })
      useNotify(`Welcome ${user.username}`)
    } catch (exception) {
      useNotify(exception.response.data['error'], 'error')
    }
  }
}

export const useUserFromStorage = () => {
  const dispatch = useUserDispatch()
  return (user) => {
    dispatch({ type: 'SET_USER', payload: user })
    blogService.setToken(user.token)
  }
}

export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export const useNotificationDispatch = () => {
  const valueAndDispatch = useContext(NotificationContext)
  const dispatch = valueAndDispatch[1]
  return (text, type = 'info') => {
    const payload = { text, type }
    dispatch({ type: 'SET', payload })
    setTimeout(() => {
      dispatch({ type: 'RESET' })
    }, 5000)
  }
}

export default ContextProvider
