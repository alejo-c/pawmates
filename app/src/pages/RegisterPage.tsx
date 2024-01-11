import { effect, signal } from '@preact/signals-react'
import User, { UserInfo, emptyUserInfo } from '../types/user'
import Input from '../components/Input'
import Icon from '../components/Icon'
import apiRequest from '../lib/axiosrequests'
import { Navigate, useNavigate } from 'react-router-dom'
import getLogged, { login } from '../lib/session'

const user = signal<UserInfo>(emptyUserInfo)
const loggedUser = signal<User | null>(null)

effect(() => { loggedUser.value = getLogged() })

const RegisterPage = () => {
    const navigate = useNavigate()

    if (loggedUser.value !== null) return <Navigate to='/' />

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        user.value = { ...user.value, [e.target.name]: e.target.value }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        apiRequest({ method: 'POST', url: '/users/register', data: user.value })
            .then(() => {
                apiRequest({
                    method: 'POST', url: '/users/login', data: {
                        email: user.value.email,
                        password: user.value.password
                    }
                })
                    .then(res => login(res.data.user))
                    .then(() => navigate('/'))
            })
    }

    return (
        <div className='container mt-5'>
            <h2>Register</h2>
            <div>
                <Input
                    type="text"
                    name='name'
                    icon={<Icon icon="user" />}
                    placeholder="Enter your name"
                    value={user.value.name}
                    onChange={handleChange}
                />
                <Input
                    type="email"
                    name='email'
                    icon={<Icon icon="envelope" />}
                    placeholder="Enter your email"
                    value={user.value.email}
                    onChange={handleChange}
                />
                <Input
                    type='password'
                    name='password'
                    icon={<Icon icon="key" />}
                    placeholder="Enter your password"
                    value={user.value.name}
                    onChange={handleChange}
                />
                <Input
                    type="text"
                    name='address'
                    icon={<Icon icon="localize" />}
                    placeholder="Enter your address"
                    value={user.value.name}
                    onChange={handleChange}
                />
                <button type="submit" onClick={handleSubmit}>
                    Register
                </button>
            </div>
        </div>
    )
}

export default RegisterPage
