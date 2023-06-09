import { useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'

import { useDispatch, useSelector } from 'react-redux'
import { initializeMessage } from './reducers/notificationReducer'
import { initializeBlogs, initializeNew, initializeRemove, initializeLike } from './reducers/blogsReducer'
import { loginFromStorage, loginFromForm, setPassword, setUsername, loginLogout } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.login.user)
  const username = useSelector(state => state.login.username)
  const password = useSelector(state => state.login.password)
  const blogs = useSelector(state => {
    return state.blogs.filter(blog => blog)
  })

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUserJSON) {
      const userStorage = JSON.parse(loggedUserJSON)
      dispatch(loginFromStorage(userStorage))
    }
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(loginFromForm({ username, password }))
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => dispatch(setUsername(target.value))}
          />
        </div>
        <div>
          password
          <input
            type='text'
            value={password}
            name='Password'
            onChange={({ target }) => dispatch(setPassword(target.value))}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  )

  const userLogOut = () => {
    window.localStorage.clear()
    dispatch(loginLogout())
  }

  const handleCreate = async (newObject) => {
    try {
      const userData = { name: user.name , username: user.username }
      dispatch(initializeNew(newObject, userData))
    } catch (exception) {
      dispatch(initializeMessage(exception.response.data['error'], 'error'))
    }
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
        dispatch(initializeRemove(blog))
      }
    } catch (exception) {
      dispatch(initializeMessage(`Error deleting blog, message: ${exception.response.data}`, 'error'))
    }
  }

  const likeIncrement = (blog) => {
    dispatch(initializeLike(blog))
  }

  return (
    <>
      {!user && loginForm()}
      {user &&
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>{user.name} logged in<button onClick={userLogOut}>logout</button></p>
          <Togglable buttonLabel='new blog'>
            <CreateForm
              createBlog={handleCreate}
            />
          </Togglable>
          {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} removeBlog={removeBlog} loggedUser={user} likeIncrement={likeIncrement}/>
          )}
        </div>
      }
    </>
  )
}

export default App