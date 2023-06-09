import { useMutation, useQueryClient } from 'react-query'
import blogService from '../services/blogs'

const BlogView = ({ id, blogs }) => {
  const queryClient = useQueryClient()
  const newLikeMutation = useMutation(blogService.likesIncrease, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })
  const newCommentMutation = useMutation(blogService.addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

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

  if (blogs.isLoading) {
    return <div>Please wait for data loading...</div>
  } else if (blogs.isError) {
    return <div>Could not fetch data from server!</div>
  }

  const blog = blogs.data.find((b) => b.id === id)

  if (!blog) {
    return <div>Sorry, no such blog exists.</div>
  }

  const submitComment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    console.log('Comment:', comment)
    event.target.comment.value = ''
    newCommentMutation.mutate({ id: blog.id, comment: comment })
  }

  return (
    <>
      <div>
        <h2>
          {blog.title} - {blog.author}
        </h2>
        <a href={`https://${blog.url}`}>{blog.url}</a>
        <p>
          {blog.likes} likes
          <button
            className="btn btn-success p-1.5 m-1"
            onClick={() => likeIncrement(blog)}
          >
            like
          </button>
        </p>
        <p>
          added by <i>{blog.user.name}</i>
        </p>
      </div>
      <div>
        <h2>Comments:</h2>
        <form onSubmit={submitComment}>
          <input type="text" name="comment" />
          <button type="submit" className="btn btn-primary p-1.5 m-1">
            add comment
          </button>
        </form>
        <ul>
          {blog.comments.map((com) => (
            <li key={com}>{com}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BlogView
