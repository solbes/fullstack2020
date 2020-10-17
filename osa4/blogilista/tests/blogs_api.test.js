const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const newuser = {
  username: 'author',
  name: 'authorname',
  password: 'pass1'
}

const initialBlogs = [
  {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 1
  },
  {
    title: 'title2',
    author: 'author2',
    url: 'url2',
    likes: 2
  },
]

const newBlog = {
  title: 'title3',
  author: 'author',
  url: 'url3',
  likes: 3
}

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
})

test('correct number of blogs returned as json', async () => {
  const response = await api.get('/api/blogs')
  expect(response.status).toBe(200)
  expect(response.header['content-type']).toContain('application/json')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('returned blogs contain id', async () =>{
  const response = await api.get('/api/blogs')
  response.body.forEach(
    blog => expect(blog.id).toBeDefined()
  )
})

test('adding a new blog works', async () => {

  await api.post('/api/users').send(newuser)
  const res = await api.post('/api/login').send(newuser)
  const auth = 'bearer '.concat(res.body.token)

  await api
    .post('/api/blogs')
    .set('Authorization', auth)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length+1)
  expect(response.body.map(blog => {
    delete blog.id
    delete blog.user
    return blog
  })).toContainEqual(newBlog)
})

test('adding a new blog without likes works', async () => {

  const noLikes = newBlog
  delete newBlog.likes

  const res = await api.post('/api/login').send(newuser)
  const auth = 'bearer '.concat(res.body.token)

  await api
    .post('/api/blogs')
    .set('Authorization', auth)
    .send(noLikes)

  const response = await api.get('/api/blogs')
  addedBlog = response.body.find(b => b.title === 'title3')

  expect(addedBlog.likes).toBe(0)
})

test('adding a blog with missing title/url', async () => {

  const noTitle = newBlog
  delete noTitle.title
  const noUrl = newBlog
  delete noUrl.url

  const res = await api.post('/api/login').send(newuser)
  const auth = 'bearer '.concat(res.body.token)

  await api.post('/api/blogs')
    .set('Authorization', auth)
    .send(noTitle)
    .expect(400)
  await api.post('/api/blogs')
    .set('Authorization', auth)
    .send(noUrl)
    .expect(400)

})

test('delete a blog', async () => {
  const res = await api.post('/api/login').send(newuser)
  const auth = 'bearer '.concat(res.body.token)

  const addResponse = await api
    .post('/api/blogs')
    .set('Authorization', auth)
    .send({
      title: 'title',
      author: 'author',
      url: 'url'
    })

  addedBlog = addResponse.body

  await api
    .delete(`/api/blogs/${addedBlog.id}`)
    .set('Authorization', auth)
    .expect(204)
  
  const response2 = await api.get('/api/blogs')
  expect(response2.body).toHaveLength(initialBlogs.length)
})

test('update a blog', async () => {
  const response = await api.get('/api/blogs')
  firstBlog = response.body[0]
  modifiedBlog = {...firstBlog, author: 'author_mod'}
  const putResponse = await api.put(`/api/blogs/${firstBlog.id}`).send(modifiedBlog)
  const response2 = await api.get('/api/blogs')
  expect(response2.body.find(b => b.id === firstBlog.id)).toMatchObject(modifiedBlog)
  expect(putResponse.body).toMatchObject(modifiedBlog)
})

afterAll(async () => {
  await User.deleteMany({})
  mongoose.connection.close()
})