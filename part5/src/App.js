import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateForm from './components/CreateForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ text: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notificationHandler = (text, type='info') => {
    setMessage({
      text, type
    })

    setTimeout(() => {
      setMessage({ text: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogsappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationHandler(exception.response.data['error'], 'error')
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type='text'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  )

  const userLogOut = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleCreate = async (newObject) => {
    try {
      const blogNew = await blogService.create(newObject)
      blogNew.user = { name: user.name , id: blogNew.user, username: user.username }
      setBlogs(blogs.concat(blogNew))
      notificationHandler(`new blog '${blogNew.title}' by ${blogNew.author} added`)
    } catch (exception) {
      notificationHandler(exception.response.data['error'], 'error')
    }
  }

  const removeBlog = async (blog) => {
    try {
      if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => blog.id !== b.id))
        notificationHandler(`Blog '${blog.title}' was successfully deleted`)
      }
    } catch (exception) {
      notificationHandler(`Error deleting blog, message: ${exception.response.data}`, 'error')
    }
  }

  const likeIncrement = async (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await blogService.likesIncrease(blog.id, updatedBlog)
    const freshBlogs = await blogService.getAll()
    setBlogs(freshBlogs)
  }

  return (
    <>
      {!user && loginForm()}
      {user &&
        <div>
          <h2>blogs</h2>
          <Notification message={message} />
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