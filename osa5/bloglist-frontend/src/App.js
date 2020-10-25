import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
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

const BlogForm = (props) => (
  <form onSubmit={props.onSubmit} >
    <div>
      title: <input value={props.title} onChange={props.handleTitleChange} />
    </div>
    <div>
      author: <input value={props.author} onChange={props.handleAuthorChange} />
    </div>
    <div>
      url: <input value={props.url} onChange={props.handleUrlChange} />
    </div>
    <div>
      <button type="submit">create</button>
    </div>
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

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [ addMessage, setAddMessage] = useState(null)
  const [ addFailMessage, setAddFailMessage] = useState(null)
  const [ loginFailMessage, setLoginFailMessage] = useState(null)

  const handleNameChange = ({ target }) => setUsername(target.value)
  const handlePasswordChange = ({ target }) => setPassword(target.value)
  const handleTitleChange = ({ target }) => setTitle(target.value)
  const handleAuthorChange = ({ target }) => setAuthor(target.value)
  const handleUrlChange = ({ target }) => setUrl(target.value)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setLoginFailMessage("Wrong username or password")
      setTimeout(() => setLoginFailMessage(null), 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    const newBlog = {title, author, url}
    try {
      const response = await blogService.create(newBlog, user.token)
      setBlogs(blogs.concat(response.data))
      setAuthor('')
      setTitle('')
      setUrl('')
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
      //noteService.setToken(user.token)
    }
  }, [])

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
                  style={{...messageStyle, color: 'red'}} />
      </div>
    )
  }

  //console.log(blogs)

  return (
    <div>
      <h2>blogs</h2>
      <p>{`${user.username} logged in`}
      <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm onSubmit={handleCreate}
                title={title} 
                author={author} 
                url={url} 
                handleTitleChange={handleTitleChange} 
                handleAuthorChange={handleAuthorChange} 
                handleUrlChange={handleUrlChange}/>
      <Notification 
                  message={addMessage} 
                  style={{...messageStyle, color: 'green'}} />
      <Notification 
                  message={addFailMessage} 
                  style={{...messageStyle, color: 'red'}} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App