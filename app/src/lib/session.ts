import User from '../types/user'

export const login = (user: User) => localStorage.setItem('user', JSON.stringify(user))

export const logout = () => localStorage.removeItem('user')

const getLogged = () => {
    const user = localStorage.getItem('user')
    if (user && user != 'undefined')
        return JSON.parse(user) as User
    return null
}

export default getLogged