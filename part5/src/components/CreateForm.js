
import { useState } from 'react'
import PropTypes from 'prop-types'

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
                title
          <input
            type='text'
            name='Title'
            placeholder='Title'
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
                author
          <input
            type='text'
            name='Author'
            placeholder='Author'
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
                url
          <input
            type='text'
            name='Url'
            placeholder='Url'
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

CreateForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default CreateForm









