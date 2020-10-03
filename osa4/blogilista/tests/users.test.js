const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'username1',
    name: 'name1',
    password: 'pass1'
  },
  {
    username: 'username2',
    name: 'name2',
    password: 'pass2'
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  const userObjects = initialUsers.map(user => {
    const pwdHash = bcrypt.hashSync(user.password, 10)
    return new User({
      username: user.username,
      name: user.name,
      passwordHash: pwdHash
    })
  })

  const promises = userObjects.map(user => {
    user.save()
  })
  await Promise.all(promises)
})

test('adding a user with missing username/password fails', async () => {
  const newUser = {
    name: 'name3',
    password: 'pass3'
  }
  const newUser2 = {
    username: 'user3',
    name: 'name3'
  }
  const response = await api.post('/api/users').send(newUser)
  expect(response.status).toBe(400)
  expect(response.body.error).toContain('Path `username` is required')
  
  const response2 = await api.post('/api/users').send(newUser2)
  expect(response2.status).toBe(400)
  expect(response2.body.error).toContain('password does not exist')
})

test('adding a user with existing username fails', async () => {
  const newUser = {
    username: 'username2',
    name: 'name3',
    password: 'pass3'
  }

  const resp = await api.post('/api/users').send(newUser)
  expect(resp.status).toBe(400)
  expect(resp.body.error).toContain('expected `username` to be unique')
})

test('adding a user with too short username/passwd', async () => {
  const newUser = {
    username: 'us',
    name: 'name3',
    password: 'pass3'
  }

  const resp = await api.post('/api/users').send(newUser)
  expect(resp.status).toBe(400)
  expect(resp.body.error).toContain('is shorter than the minimum allowed')
})

afterAll(() => {
  mongoose.connection.close()
})