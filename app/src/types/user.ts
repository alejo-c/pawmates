type User = {
    id: number
    role: string
    name: string
    email: string
    password: string
    address: string
    token?: string
}

export type UserCredentials = {
    email: string
    password: string
}

export type UserInfo = {
    name: string
    email: string
    password: string
    address: string
}

export const emptyUser = {
    id: 0,
    role: '',
    name: '',
    email: '',
    password: '',
    address: '',
}

export const emptyUserCredentials = {
    email: '',
    password: '',
}

export const emptyUserInfo = {
    name: '',
    email: '',
    password: '',
    address: '',
}

export default User