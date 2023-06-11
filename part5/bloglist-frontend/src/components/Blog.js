import React, { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, showBanner }) => {
  const [view, setView] = useState(false)
  const [viewMessage, setViewMessage] = useState('view')

  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const visible = { display: view ? '' : 'none' }

  const showView = () => {
    setView(!view)
    setViewMessage(view ? 'view' : 'hide')
  }

  const handleLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    const result = await likeBlog(updatedBlog)
    if (result) {
      showBanner('green', `liked ${blog.title} by ${blog.author}`)
    } else {
      showBanner('red', 'could not like blog')
    }
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      const result = await removeBlog(blog.id)
      if (result) {
        showBanner('green', `removed ${blog.title} by ${blog.author}`)
      } else {
        showBanner('red', 'could not remove blog')
      }
    }
  }

  const showRemove = {
    display:
      blog.user.username === JSON.parse(window.localStorage.getItem('bloglistUser')).username
        ? ''
        : 'none',
  }

  return (
    <div className='blog' style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button id='viewButton' onClick={showView}>{viewMessage}</button>
      <div style={visible}>
        <div id='url'>{blog.url}</div>
        <div id='likes'>
          likes {blog.likes} <button id='likeButton' onClick={handleLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        <div id='removeButton' style={showRemove}>
          <button onClick={handleRemove}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
