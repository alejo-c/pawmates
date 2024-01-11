import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, getUserById } from '../models/user-model.js'

const hashPassword = async password => {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
}

export const createUser = async (req, res) => {
    if (req.body.name === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The user name is required'
    })
    if (req.body.email === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The user email is required'
    })
    if (req.body.password === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The user password is required'
    })

    req.body.password = await hashPassword(req.body.password)
    const user = await User.create(req.body)

    res.status(201).jsonPretty({
        type: 'success',
        message: `User ${user.name} (id: ${user.id}) created successfully`,
        created: user
    })
}

export const loginUser = async (req, res) => {
    if (req.body.email === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The user email is required'
    })
    if (req.body.password === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The user password is required'
    })

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `User with email ${req.body.email} not found`
    })

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordValid) return res.status(401).jsonPretty({
        type: 'error',
        message: 'Invalid password'
    })

    const token = jwt.sign({ user }, process.env.SESSION_SECRET, { expiresIn: '1h' })
    req.session.user = { ...user.dataValues, token }

    res.status(200).jsonPretty({
        type: 'success',
        message: `User ${user.name} logged in successfully`,
        user: { ...user.dataValues, token }
    })
}

export const logoutUser = (req, res) => {
    if (req.session.user === undefined) return res.status(401).jsonPretty({
        type: 'error',
        message: 'You are not logged in'
    })

    req.session.destroy()
    res.status(200).jsonPretty({
        type: 'success',
        message: 'User logged out successfully'
    })
}

export const readUsers = async (req, res) => {
    const users = await User.findAll()
    const length = users.length

    if (length === 0) return res.status(500).jsonPretty({
        type: 'error',
        message: 'There is no users',
        length
    })
    res.status(200).jsonPretty({ collection: users, length })
}

export const readUser = async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)

    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `User with id ${id} not found`
    })
    res.status(200).jsonPretty({ object: user })
}

export const updateUser = async (req, res) => {
    const id = req.params.id
    const { name, role, email, password, address } = req.body

    const user = await getUserById(id)
    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `User with id ${id} does not exists`
    })

    const isInvalidData = !name && !role && !email && !password && !address
    if (isInvalidData) return res.status(400).jsonPretty({
        type: 'error',
        message: 'There is not valid data for update'
    })

    if (password !== undefined)
        req.body.password = await hashPassword(password)
    user.update(req.body)

    res.status(200).jsonPretty({
        type: 'success',
        message: `User ${user.name} (id: ${id}) updated successfully`,
        updated: user
    })
}

export const deleteUser = async (req, res) => {
    const id = req.params.id
    const user = await getUserById(id)

    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `User with id ${id} does not exists`
    })

    user.destroy()
    res.status(200).jsonPretty({
        type: 'success',
        message: `User ${user.name} (id: ${id}) deleted successfully`,
        deleted: user
    })
}
