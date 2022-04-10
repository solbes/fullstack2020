import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blogUser = {
  id: 1,
  username: 'test blog user'
}

const blog = {
  user: blogUser,
  likes: 0,
  author: 'test author',
  title: 'test title',
  url: 'test url'
}

const user = {
  id: 1,
  username: 'test blog user',
}

test('renders title and author only', () => {

  const mockHandleRemove = jest.fn()

  render(<Blog blog={blog} user={user} handleRemove={mockHandleRemove} />)

  const element = screen.getByText('test title test author')

  expect(element).toHaveTextContent(blog.title)
  expect(element).toHaveTextContent(blog.author)
  expect(element).not.toHaveTextContent(blog.url)
  expect(element).not.toHaveTextContent(blog.likes)
})

test('renders all if show clicked', () => {

  const mockHandleRemove = jest.fn()

  render(<Blog blog={blog} user={user} handleRemove={mockHandleRemove} />)

  const button = screen.getByText('show')
  userEvent.click(button)

  expect(screen.getByText('test url')).toBeDefined()
  expect(screen.getByText('likes: 0')).toBeDefined()

  screen.debug(screen.getByText('test title test author'))
})