const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.password) {
    return response.status(400).json({ error: 'password does not exist' })
  }
  if (body.password.length < 3) {
    return response.status(400).json({ error: 'password length < 3' })
  }

  const pwdHash = await bcrypt.hash(body.password, 10)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: pwdHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })
  response.json(users)
})

module.exports = usersRouter