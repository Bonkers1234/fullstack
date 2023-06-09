import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Blog = ({ blog, removeBlog, loggedUser, likeIncrement }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 3,
    paddingLeft: 2,
    border: 'solid',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="blog" style={blogStyle}>
      <div style={hideWhenVisible} className="contracted">
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} - {blog.author}
        </Link>
        <button
          type="button"
          className="btn btn-outline-secondary m-2"
          onClick={toggleVisibility}
        >
          view
        </button>
      </div>
      <div style={showWhenVisible} className="expanded">
        {blog.title} - {blog.author}
        <button
          type="button"
          className="btn btn-outline-dark m-2"
          onClick={toggleVisibility}
        >
          hide
        </button>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button
            type="button"
            className="btn btn-success p-1.5 m-1"
            onClick={() => likeIncrement(blog)}
          >
            like
          </button>
        </div>
        <div>{blog.user.name}</div>
        {blog.user.username === loggedUser.username && (
          <button
            className="btn btn-outline-danger p-1.5 m-1"
            onClick={() => removeBlog(blog)}
          >
            delete
          </button>
        )}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
}

export default Blog
