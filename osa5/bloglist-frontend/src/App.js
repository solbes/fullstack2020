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

const App = () => {
  const [blogs, setBlogs] = useState([])
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const handleNameChange = ({ target }) => setUsername(target.value)
  const handlePasswordChange = ({ target }) => setPassword(target.value)

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
      console.log("Login failed")
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
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
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{`${user.username} logged in`}
      <button onClick={handleLogout}>logout</button>
      </p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App