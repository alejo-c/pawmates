import express from 'express'
import * as controller from '../controllers/users-controller.js'

const router = express.Router()

router.get('/', controller.readUsers)
router.get('/:id', controller.readUser)
router.post('/register', controller.createUser)
router.post('/login', controller.loginUser)
router.post('/logout', controller.logoutUser)
router.put('/update/:id', controller.updateUser)
router.delete('/delete/:id', controller.deleteUser)

export { router as usersRouter }