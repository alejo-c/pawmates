import { Link, useNavigate } from 'react-router-dom'
import getLogged, { logout } from '../lib/session'
import { effect, signal } from '@preact/signals-react'
import User from '../types/user'
import { useSignals } from '@preact/signals-react/runtime'

const loggedUser = signal<User | null>(null)

effect(() => { loggedUser.value = getLogged() })

const UserMenu = () => {
    useSignals()

    const navigate = useNavigate()

    if (loggedUser.value === null) return <LoginButton />

    const logOut = () => {
        logout()
        navigate('/login')
    }

    return <>
        <div className='dropdown'>
            <button
                className='btn dropdown-toggle'
                type='button'
                data-bs-toggle='dropdown'
            >
                <img
                    src={`https://ui-avatars.com/api/?name=${loggedUser.value.name}&background=random&rounded=true`}
                    width={30}
                />
            </button>
            <ul className='dropdown-menu dropdown-menu-end'>
                <li><Link className='dropdown-item' to='/profile'>Profile</Link></li>
                <li><hr className='dropdown-divider' /></li>
                <li><button className='dropdown-item' onClick={logOut}>Logout</button></li>
            </ul>
        </div >
        {/* <div className='dropdown'>
            <button
                className='btn dropdown-toggle'
                type='button'
                id='dropdownMenuButton'
                data-bd-toggle='dropdown'
            >
            </button>
            <div className='dropdown-menu'>
            </div>
        </div> */}
    </>
}

const LoginButton = () => (
    <Link className='btn btn-primary' to='/login'>
        <small><strong>Login</strong></small>
    </Link>
)


export default UserMenu