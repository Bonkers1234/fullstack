import { useEffect } from 'react'
import Notification from './components/Notification'
import Users from './components/Users'
import DefaultView from './components/DefaultView'
import BlogView from './components/BlogView'
import User from './components/User'
import NavBar from './components/NavBar'
import { Routes, Route, useMatch } from 'react-router-dom'
import { useQuery } from 'react-query'
import userService from './services/users'
import blogService from './services/blogs'

import {
  useUserFromStorage,
  useUserLogin,
  useUserValue,
  useUserDispatch,
  useLogout,
} from './contexts/GeneralContext'

import { Form, Button } from 'react-bootstrap'

const App = () => {
  const userValue = useUserValue()
  const userDispatch = useUserDispatch()

  const assignUserFromStorage = useUserFromStorage()
  const assignUserLogin = useUserLogin()
  const assignLogout = useLogout()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      assignUserFromStorage(user)
    }
  }, [])

  const handleLogin = (event) => {
    event.preventDefault()
    assignUserLogin()
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control
            type="text"
            value={userValue.username}
            name="Username"
            onChange={({ target }) =>
              userDispatch({ type: 'SET_USERNAME', payload: target.value })
            }
          />
          <Form.Label>password</Form.Label>
          <Form.Control
            type="text"
            value={userValue.password}
            name="Password"
            onChange={({ target }) =>
              userDispatch({ type: 'SET_PASSWORD', payload: target.value })
            }
          />
          <Button variant="primary" type="submit">
            login
          </Button>
        </Form.Group>
      </Form>
    </>
  )

  const matchUser = useMatch('/users/:id')
  const matchId = matchUser ? matchUser.params.id : null

  const matchBlog = useMatch('/blogs/:id')
  const blogId = matchBlog ? matchBlog.params.id : null

  const usersData = useQuery('users', userService.getAll, {
    refetchOnWindowFocus: false,
  })

  const resultBlog = useQuery('blogs', blogService.getAll, {
    refetchOnWindowFocus: false,
  })

  return (
    <div className="container">
      {!userValue.user && loginForm()}
      {userValue.user && (
        <div>
          <NavBar />
          <h2>blogs</h2>
          <Notification />
          <p>
            {userValue.user.name} logged in
            <button className="btn btn-secondary m-1" onClick={assignLogout}>
              logout
            </button>
          </p>
          <Routes>
            <Route path="/" element={<DefaultView resultBlog={resultBlog} />} />
            <Route path="/users" element={<Users usersData={usersData} />} />
            <Route
              path="/users/:id"
              element={<User id={matchId} usersData={usersData} />}
            />
            <Route
              path="/blogs/:id"
              element={<BlogView id={blogId} blogs={resultBlog} />}
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
