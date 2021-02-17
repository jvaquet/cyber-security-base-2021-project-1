const { response } = require('express')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const db = require('./database')

const JWT_SECRET = 'SECURE123'
/*
FIX FOR FLAW 7:
const JWT_SECRET = process.env.JWT_SECRET
*/

db.initialize()
const app = express()
app.use(cors())

app.use(express.json())
//app.use(express.static('build'))

app.post('/api/messages', async (request, response) => {
  const authHeader = request.header('Authorization')
  if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    response.status(401).send()
    return
  }

  const token = authHeader.substring(7)
  const message = request.body.message
  const to = request.body.to
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = payload.username
    if(user && message && to) {
      await db.addMessage(message, to, user)
      response.status(200).send()
    } else {
      response.status(400).send()
    }
  } catch (e) {
    console.log(e)
    response.status(401).send()
  }
})

app.get('/api/messages/:user', async (request, response) => {
  const user = request.params.user
  const messages = await db.getMessagesForUser(user)
  response.json(messages)
})
/*
FIX FOR FLAW 3:
// This replaces the method above.
// Accordingly remove the user url parameter from the request in the frontend

app.get('/api/messages/', async (request, response) => {
  const authHeader = request.header('Authorization')
  if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    response.status(401).send()
    return
  }

  const token = authHeader.substring(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = payload.username
    if(user) {
      const messages = await db.getMessagesForUser(user)
      response.json(messages)
    } else {
      response.status(400).send()
    }
  } catch (e) {
    response.status(401).send()
  }
})
*/

app.get('/api/likes/', async (request, response) => {
  const authHeader = request.header('Authorization')
  if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    response.status(401).send()
    return
  }

  const token = authHeader.substring(7)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = payload.username
    if(user) {
      const likes = await db.getLikesForUser(user)
      response.json({likes})
    } else {
      response.status(400).send()
    }
  } catch (e) {
    response.status(401).send()
  }
})

app.post('/api/likes', async (request, response) => {
  const authHeader = request.header('Authorization')
  if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    response.status(401).send()
    return
  }

  const token = authHeader.substring(7)
  const likedUser = request.body.user
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    /*
    FIX FOR FLAW 4:
    const user = payload.username
    if(user === likedUser) {
      response.status(403).send('You can not like yourself')
      return
    }
    */
    if(likedUser) {
      await db.addLikeToUser(likedUser)
      response.status(200).send()
    } else {
      response.status(400).send()
    }
  } catch (e) {
    response.status(401).send()
  }
})

app.post('/api/login', async (request, response) => {
  const username = request.body.username
  const password = request.body.password
  if(username && password && await db.checkLogin(username, password)) {
    const token = jwt.sign({ username }, JWT_SECRET)
    response.json({token})
  } else {
    response.status(401).send()
  }
})

app.post('/api/password', async (request, response) => {
  const authHeader = request.header('Authorization')
  if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    response.status(401).send()
    return
  }

  const token = authHeader.substring(7)
  const password = request.body.password
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = payload.username
    if(user && password) {
      await db.changePassword(user, password)
      response.status(200).send()
    } else {
      response.status(400).send()
    }
  } catch (e) {
    response.status(401).send()
  }
})

app.get('/api/users', async (request, response) => {
  const users = await db.getUsers()
  response.json(users)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
