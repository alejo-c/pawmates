import jwt from 'jsonwebtoken'

export const ensureLoggedIn = (req, res, next) => {
    res.json({ user: req.session.user })
    if (req.session.user === undefined) return res.status(403).jsonPretty({
        type: 'error',
        message: 'You are not logged in'
    })
    next()
}

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next() // pass the execution off to whatever request the client intended
    })
}