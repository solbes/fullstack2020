import React, { useState } from 'react'



const BlogForm = ({createBlog}) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitleChange = ({ target }) => setTitle(target.value)
  const handleAuthorChange = ({ target }) => setAuthor(target.value)
  const handleUrlChange = ({ target }) => setUrl(target.value)

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {title, author, url}
    createBlog(newBlog)
    setAuthor('')
    setTitle('')
    setUrl('')
  }
  
  return (
    <form onSubmit={addBlog} >
      <div>
        title: <input value={title} onChange={handleTitleChange} />
      </div>
      <div>
        author: <input value={author} onChange={handleAuthorChange} />
      </div>
      <div>
        url: <input value={url} onChange={handleUrlChange} />
      </div>
      <div>
        <button type="submit">create</button>
      </div>
    </form>
  )
}

export default BlogForm