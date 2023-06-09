import Togglable from './Togglable'
import CreateForm from './CreateForm'
import Blog from './Blog'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from 'react-query'
import {
  useNotificationDispatch,
  useUserValue,
} from '../contexts/GeneralContext'

const DefaultView = ({ resultBlog }) => {
  const queryClient = useQueryClient()
  const userValue = useUserValue()
  const useNotify = useNotificationDispatch()

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newObject) => {
      queryClient.invalidateQueries('blogs')
      queryClient.invalidateQueries('users')
      useNotify(`new blog '${newObject.title}' by ${newObject.author} added`)
    },
    onError: (err) => {
      useNotify(err.response.data['error'], 'error')
    },
  })
  //Second argument in 'onSuccess' provides '.mutate' passed variables
  const newDeleteMutation = useMutation(blogService.deleteBlog, {
    onSuccess: (_, blogId) => {
      const deleteBlog = blogs.find((blog) => blog.id === blogId)
      queryClient.invalidateQueries('blogs')
      queryClient.invalidateQueries('users')
      useNotify(`Blog '${deleteBlog.title}' was successfully deleted`)
    },
    onError: (err) => {
      useNotify(err.response.data['error'], 'error')
    },
  })
  const newLikeMutation = useMutation(blogService.likesIncrease, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`)) {
      newDeleteMutation.mutate(blog.id)
    }
  }

  const likeIncrement = (blog) => {
    const updatedBlog = {
      id: blog.id,
      blog: {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      },
    }
    newLikeMutation.mutate(updatedBlog)
  }

  if (resultBlog.isLoading) {
    return <div>Loading data, please wait...</div>
  } else if (resultBlog.isError) {
    return <div>Error fetching data from server!</div>
  }

  const blogs = resultBlog.data

  return (
    <div>
      <Togglable buttonLabel="new blog">
        <CreateForm createBlog={newBlogMutation.mutate} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            removeBlog={removeBlog}
            loggedUser={userValue.user}
            likeIncrement={likeIncrement}
          />
        ))}
    </div>
  )
}

export default DefaultView
