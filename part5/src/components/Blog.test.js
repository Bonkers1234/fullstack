
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container

  const user = {
    token: '123',
    username: 'John',
    name: 'Johnnn'
  }

  const mockRemove = jest.fn()
  const mockLike = jest.fn()
  const blogPost = {
    title: 'Test title',
    author: 'Someone',
    url: 'https://greatwebsite.com',
    likes: 50,
    user: {
      name: 'John',
      id: '30'
    }
  }

  beforeEach(() => {
    container = render(
      <Blog blog={blogPost} removeBlog={mockRemove} loggedUser={user} likeIncrement={mockLike}/>
    ).container
  })

  test('renders title and author but not url or likes', () => {
    const div = container.querySelector('.contracted')
    const div1 = container.querySelector('.expanded')

    expect(div).not.toHaveStyle('display: none')
    expect(div1).toHaveStyle('display: none')
    expect(div).toHaveTextContent(`${blogPost.title} - ${blogPost.author}`)
    expect(div).not.toHaveTextContent(`${blogPost.likes}`)
    expect(div).not.toHaveTextContent(`${blogPost.url}`)
  })

  test('show url and likes when view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.expanded')
    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent(`${blogPost.likes}`)
    expect(div).toHaveTextContent(`${blogPost.url}`)
  })

  test('check if likes button is clicked x2 even is registered', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likes = screen.getByText('like')
    await user.click(likes)
    await user.click(likes)
    expect(mockLike.mock.calls).toHaveLength(2)

  })
})



