import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const LoginForm = (props) => (
  <form onSubmit={props.handleLogin}>
    <div>
      username
      <input
        type="text"
        value={props.username}
        name="Username"
        onChange={props.handleNameChange}
      />
    </div>
    <div>
      password
      <input
        type="password"
        value={props.password}
        name="Password"
        onChange={props.handlePasswordChange}
      />
    </div>
    <button type="submit">login</button>
  </form>
)

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

const messageStyle = {
  fontSize: 16,
  background: 'lightgrey',
  borderStyle: 'solid',
  borderRadius: 5,
  padding: 10,
  marginTop: 10,
  marginBottom: 10
}

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [ addMessage, setAddMessage] = useState(null)
  const [ addFailMessage, setAddFailMessage] = useState(null)
  const [ loginFailMessage, setLoginFailMessage] = useState(null)

  const handleNameChange = ({ target }) => setUsername(target.value)
  const handlePasswordChange = ({ target }) => setPassword(target.value)

  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setLoginFailMessage('Wrong username or password')
      setTimeout(() => setLoginFailMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(blogObject, user.token)
      setBlogs(blogs.concat(response.data))
      setAddMessage(`A new blog ${response.data.title} by ${response.data.author} added`)
      setTimeout(() => setAddMessage(null), 5000)
    } catch (exception) {
      setAddFailMessage(`Adding failed: ${exception.message}`)
      setTimeout(() => setAddFailMessage(null), 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const removeBlog = (blog, user) => {
    window.confirm(`Remove ${blog.title} by ${blog.user.name}?`)
    blogService.remove(blog.id, user.token)
    setBlogs(blogs.filter(b => b.id !== blog.id))
  }

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm  handleLogin={handleLogin}
          username={username}
          handleNameChange={handleNameChange}
          password={password}
          handlePasswordChange={handlePasswordChange} />
        <Notification
          message={loginFailMessage}
          style={{ ...messageStyle, color: 'red' }} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{`${user.username} logged in`}
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <Notification
        message={addMessage}
        style={{ ...messageStyle, color: 'green' }} />
      <Notification
        message={addFailMessage}
        style={{ ...messageStyle, color: 'red' }} />
      {blogs.sort((a,b) => b.likes-a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleRemove={() => removeBlog(blog,user)} />
      )}
    </div>
  )
}

export default App