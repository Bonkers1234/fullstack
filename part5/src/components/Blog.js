
import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, removeBlog, loggedUser, likeIncrement }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
      <div style={hideWhenVisible} className='contracted'>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='expanded'>
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>hide</button>
        <div>{blog.url}</div>
        <div>likes {blog.likes}<button onClick={() => likeIncrement(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === loggedUser.username &&
        <button onClick={() => removeBlog(blog)}>delete</button>
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog