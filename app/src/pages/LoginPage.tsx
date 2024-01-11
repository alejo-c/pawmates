import Input from '../components/Input'
import Icon from '../components/Icon'
import apiRequest from '../lib/axiosrequests'
import User, { UserCredentials, emptyUserCredentials } from '../types/user'
import { effect, signal } from '@preact/signals-react'
import { Navigate, useNavigate } from 'react-router-dom'
import getLogged, { login } from '../lib/session'

const user = signal<UserCredentials>(emptyUserCredentials)
const loggedUser = signal<User | null>(null)

effect(() => { loggedUser.value = getLogged() })

const LoginPage = () => {
    const navigate = useNavigate()

    if (loggedUser.value !== null) return <Navigate to='/' />

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        user.value = { ...user.value, [e.target.name]: e.target.value }
    }

    const handleLogin = (e: any) => {
        e.preventDefault()
        apiRequest({
            method: 'POST', url: '/users/login', data: {
                email: user.value.email,
                password: user.value.password
            }
        })
            .then(res => {
                login(res.data.user)
                return <Navigate to='/' />
            })
    }

    return (
        <form className="container mt-5">
            <h1 className="text-center my-4">Login Page</h1>
            <Input
                type="email"
                icon={<Icon icon="envelope" />}
                name="email"
                placeholder="Enter your email"
                value={user.value.email}
                onChange={handleChange}
            />
            <Input
                type="password"
                icon={<Icon icon="key" />}
                name="password"
                placeholder="Enter your password"
                value={user.value.password}
                onChange={handleChange}
            />
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </form>
    )
}

export default LoginPage