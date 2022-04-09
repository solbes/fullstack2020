import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user ,handleRemove }) => {

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

  const handleLike = () => {
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

  const showRemoveButton = user.username === blog.user.username

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
        {showRemoveButton ? <div><button onClick={handleRemove}>remove</button></div> : null}
        <div><button onClick={handleVisibility}>hide</button></div>
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog
