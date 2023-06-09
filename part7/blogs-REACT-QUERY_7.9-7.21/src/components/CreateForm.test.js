import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

test('', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<CreateForm createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('Title')
  const inputAuthor = screen.getByPlaceholderText('Author')
  const inputUrl = screen.getByPlaceholderText('Url')
  const submitButton = screen.getByText('create')

  await user.type(inputTitle, 'Testing')
  await user.type(inputAuthor, 'Someone')
  await user.type(inputUrl, 'www.omg.com')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing')
  expect(createBlog.mock.calls[0][0].author).toBe('Someone')
  expect(createBlog.mock.calls[0][0].url).toBe('www.omg.com')
})
