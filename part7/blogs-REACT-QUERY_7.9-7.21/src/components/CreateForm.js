import { useState } from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Row className="mb-2">
            <Col xs={1}>
              <Form.Label>title</Form.Label>
            </Col>
            <Col xs={3}>
              <Form.Control
                type="text"
                name="Title"
                placeholder="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={1}>
              <Form.Label>author</Form.Label>
            </Col>
            <Col xs={3}>
              <Form.Control
                type="text"
                name="Author"
                placeholder="Author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={1}>
              <Form.Label>url</Form.Label>
            </Col>
            <Col xs={3}>
              <Form.Control
                type="text"
                name="Url"
                placeholder="Url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </Col>
          </Row>
          <button type="submit" className="btn btn-success m-1">
            create
          </button>
        </Form.Group>
      </Form>
    </>
  )
}

CreateForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default CreateForm
