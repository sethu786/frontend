// Import required modules
const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'expenseTracker.db')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    await createTables()
    app.listen(3000, () => {
      console.log(`Server Running at http://localhost:3000/`)
    })
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const createTables = async () => {
  await db.exec(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );
    `)

  await db.exec(`
        CREATE TABLE IF NOT EXISTS expense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            amount REAL,
            category TEXT,
            date TEXT,
            payment_method TEXT,
            FOREIGN KEY (user_id) REFERENCES user(id)
        );
    `)
}

// User Registration
app.post('/register/', async (request, response) => {
  const {username, password, name, gender} = request.body

  const userCheckQuery = `
    SELECT * FROM user WHERE username = '${username}';`
  const dbUser = await db.get(userCheckQuery)
  if (dbUser === undefined) {
    if (password.length < 6) {
      response.status(400)
      response.send('Password is too short')
    } else {
      const hashPassword = await bcrypt.hash(password, 10)
      const registerUserQuery = `
            INSERT INTO 
                user(username, password, name, gender)
            VALUES
                ('${username}', '${hashPassword}', '${name}', '${gender}');`
      await db.run(registerUserQuery)
      response.send('User created successfully')
    }
  } else {
    response.status(400)
    response.send('User already exists')
  }
})
const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'SECRET_KEY', async (error, payLoad) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.headers.username = payLoad.username
        next()
      }
    })
  }
}

//API: Login User
app.post('/login/', async (request, response) => {
  const {username, password} = request.body
  const payLoad = {username}
  const jwtToken = jwt.sign(payLoad, 'SECRET_KEY')
  const userCheckQuery = `
    SELECT * FROM user WHERE username = '${username}';`
  const dbUser = await db.get(userCheckQuery)
  if (dbUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatches = await bcrypt.compare(password, dbUser.password)
    if (isPasswordMatches) {
      response.send({jwtToken})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})
// Add Expense
app.post('/expenses', authenticateToken, async (req, res) => {
  console.log('1')
  console.log(req.body)
  const {title, amount, category, date, paymentMethod} = req.body
  await db.run(
    `INSERT INTO expense (user_id, title, amount, category, date, payment_method) VALUES (?, ?, ?, ?, ?, ?)`,
    [req.userId, title, amount, category, date, paymentMethod],
  )
  res.send('Expense added successfully')
})

// Get User Expenses
app.get('/expenses', authenticateToken, async (req, res) => {
  const expenses = await db.all(`SELECT * FROM expense WHERE user_id = ?`, [
    req.userId,
  ])
  res.send(expenses)
})

// Delete Expense
app.delete('/expenses/:id', authenticateToken, async (req, res) => {
  await db.run(`DELETE FROM expense WHERE id = ? AND user_id = ?`, [
    req.params.id,
    req.userId,
  ])
  res.send('Expense deleted successfully')
})

// Update Expense
app.put('/expenses/:id', authenticateToken, async (req, res) => {
  const {title, amount, category, date, paymentMethod} = req.body
  await db.run(
    `UPDATE expense SET title = ?, amount = ?, category = ?, date = ?, payment_method = ? WHERE id = ? AND user_id = ?`,
    [title, amount, category, date, paymentMethod, req.params.id, req.userId],
  )
  res.send('Expense updated successfully')
})

module.exports = app
