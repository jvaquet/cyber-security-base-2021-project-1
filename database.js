
const Database = require('sqlite-async')
// This import is needed for the fixes below
//const bcrypt = require('bcrypt')
let db

const sanitize = (str) => {
  return str.replace(/"/g, '')
}

const initialize = async () => {
  db = await Database.open('database.db')

  // Initialize database with some users
  const isInitialized = await db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="Users";')
  if(!isInitialized) {
    await db.exec('CREATE TABLE Users (name VARCHAR(255), password VARCHAR(255), admin BOOL, likes INT);')
    await db.exec('INSERT INTO Users (name, password, admin, likes) VALUES ("admin", "1337", true, 0);')
    await db.exec('INSERT INTO Users (name, password, admin, likes) VALUES ("user1", "6969", false, 0);')
    await db.exec('INSERT INTO Users (name, password, admin, likes) VALUES ("user2", "1234", false, 0);')
    await db.exec('CREATE TABLE Messages (message VARCHAR(255), to_user VARCHAR(255), from_user VARCHAR(255));')
  }
}

const addMessage = async (message, to_user, from_user) => {
  /*
  FIX FOR FLAW 1:
  message = sanitize(message)
  to_user = sanitize(to_user)
  from_user = sanitize(from_user)
  */
  await db.exec(`INSERT INTO Messages (message, to_user, from_user) VALUES ("${message}", "${to_user}", "${from_user}");`)
}

const getMessagesForUser = async (user) => {
  user = sanitize(user)
  return await db.all(`SELECT message AS msg, from_user AS from_user FROM Messages WHERE to_user = "${user}"`)
}

const getLikesForUser = async (user) => {
  user = sanitize(user)
  try {
    const res = await db.get(`SELECT likes FROM Users WHERE name = '${user}' `)
    return res.likes
  } catch {
    return 0
  }
}

const addLikeToUser = async (user) => {
  user = sanitize(user)
  await db.exec(`UPDATE Users SET likes = likes + 1 WHERE name = '${user}' `)
}

const checkLogin = async (username, password) => {
  user = sanitize(user)
  user = sanitize(password)
  const res = await db.all(`SELECT * FROM Users WHERE name = '${username}' AND password = '${password}' `)
  return res.length > 0
  /*
  FIX FOR FLAW 6:
  const res = await db.get(`SELECT password FROM Users WHERE name = '${username}' `)
  const auth = await bcrypt.compare(password, res.password)
  */
}

const changePassword = async (user, password) => {
  user = sanitize(user)
  user = sanitize(password)
  await db.exec(`UPDATE Users SET password = '${password}' WHERE name = '${user}' `)
  /*
  FIX FOR FLAW 6:
  const passwordHash = await bcrypt.hash(password, 10)
  await db.exec(`UPDATE Users SET password = '${passwordHash}' WHERE name = '${user}' `)
  */
}

const getUsers = async () => {
  return (await db.all('SELECT name FROM Users')).map(user => user.name)
}

module.exports = {
  initialize,
  addMessage,
  getMessagesForUser,
  getLikesForUser,
  addLikeToUser,
  checkLogin,
  changePassword,
  getUsers
}