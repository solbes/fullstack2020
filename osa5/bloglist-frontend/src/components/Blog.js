import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const handleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = (event) => {
    const putBlog = {
      user: blog.user.id,
      likes: likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    setLikes(likes+1)
    blogService.replace(blog.id, putBlog, user.token)
  }

  const handleRemove = (event) => {
    window.confirm(`Remove ${blog.title} by ${blog.user}?`)
    // this needs to be handled in App-level to get immediate response
    // in order to acces the "blogs" state
    blogService.remove(blog.id, user.token)
  }

  if (!showDetails) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author} <button onClick={handleVisibility}>show</button>
      </div>
    )
  } else {
    return (
      <div style={blogStyle}>
        <div>{blog.title} {blog.author}</div>
        <div>{blog.url}</div>
        <div>likes: {likes} <button onClick={handleLike}>like</button></div>
        <div>{user.username}</div>
        <div><button onClick={handleRemove}>remove</button></div>
        <div><button onClick={handleVisibility}>hide</button></div>
      </div>
    )
  }
}

export default Blog
