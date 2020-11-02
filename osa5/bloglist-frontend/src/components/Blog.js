import React, { useState } from 'react'

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
    console.log('pressed')
    console.log(blog)
    console.log(user)
    setLikes(likes+1)
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
        <div><button onClick={handleVisibility}>hide</button></div>
      </div>
    )
  }
}

export default Blog
