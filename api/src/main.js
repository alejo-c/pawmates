import express from 'express'
import cors from 'cors'
import session from 'express-session'
import SequelizeStore from 'connect-session-sequelize'
import 'dotenv/config.js'

import { db } from './database/config.db.js'
import { breedsRouter } from './routes/breeds-router.js'
import { petsRouter } from './routes/pets-router.js'
import { usersRouter } from './routes/users-router.js'
import { requestsRouter } from './routes/adoption-requests-router.js'

const app = express()
const PORT = 8000

// Middlewares
app.use(express.json())
app.use(cors())

// JSON pretty print middleware
app.use((req, res, next) => {
    res.jsonPretty = jsonObj => res.send(JSON.stringify(jsonObj, null, 2))
    next()
})

// User session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new (SequelizeStore(session.Store))({ db }),
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    }
}))

// Routes
app.use('/api/adoption-requests', requestsRouter)
app.use('/api/pets', petsRouter)
app.use('/api/breeds', breedsRouter)
app.use('/api/users', usersRouter)

// ORM auth, sync and server start
db.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error(`Error at database connection: ${err}`))

db.sync().then(() =>
    app.listen(PORT, () =>
        console.log(`Server started at http://localhost:${PORT}`)
    )
).catch(err => console.error(`Error at database sync: ${err}`))

export default app