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

const newBlog = {
  title: 'title3',
  author: 'author3',
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

  const noLikes = newBlog
  delete newBlog.likes

  await api.post('/api/blogs').send(noLikes)

  const response = await api.get('/api/blogs')
  addedBlog = response.body.find(b => b.title === 'title3')

  expect(addedBlog.likes).toBe(0)
})

test('adding a blog with missing title/url', async () => {

  const noTitle = newBlog
  delete noTitle.title
  const noUrl = newBlog
  delete noUrl.url

  await api.post('/api/blogs').send(noTitle).expect(400)
  await api.post('/api/blogs').send(noUrl).expect(400)

})

test('delete a blog', async () => {
  const response = await api.get('/api/blogs')
  firstBlog = response.body[0]
  await api.delete(`/api/blogs/${firstBlog.id}`).expect(204)
  const response2 = await api.get('/api/blogs')
  expect(response2.body).toHaveLength(initialBlogs.length-1)
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

afterAll(() => {
  mongoose.connection.close()
})