const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

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
  const newBlog = {
    title: 'title3',
    author: 'author3',
    url: 'url3',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length+1)
  expect(response.body.map(blog => {
    delete blog.id
    return blog
  })).toContainEqual(newBlog)
})

test('adding a new blog without likes works', async () => {
  const newBlog = {
    title: 'title3',
    author: 'author3',
    url: 'url3'
  }

  await api.post('/api/blogs').send(newBlog)

  const response = await api.get('/api/blogs')
  addedBlog = response.body.find(b => b.title === 'title3')

  expect(addedBlog.likes).toBe(0)
})

afterAll(() => {
  mongoose.connection.close()
})