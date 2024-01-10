type User = {
    id: number
    role: string
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

export default User