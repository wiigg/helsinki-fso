import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'

import Blog from './Blog'

test('renders the blog title and author, but not the url or likes by default', () => {
  // login user
  const user = {
    username: 'testuser',
    name: 'Test User',
  }
  window.localStorage.setItem('bloglistUser', JSON.stringify(user))

  // create blog
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test URL',
    likes: 7,
    user: {
      username: 'testuser',
      name: 'Test User',
    },
  }

  const { container } = render(<Blog blog={blog} />)

  // title and author should be visible
  let div = container.querySelector('#blog')
  expect(div).toHaveTextContent(`${blog.title} ${blog.author}`)

  // url and likes should not be visible
  div = container.querySelector('#url')
  expect(div).not.toBeVisible()

  div = container.querySelector('#likes')
  expect(div).not.toBeVisible()
})
