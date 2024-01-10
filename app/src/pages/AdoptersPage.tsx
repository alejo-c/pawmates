import { useSignals } from '@preact/signals-react/runtime'
import { batch, effect, signal } from '@preact/signals-react'

import Icon from '../components/Icon'
import Input from '../components/Input'
import Table from '../components/Table'
import ActionButton from '../components/ActionButton'
import { confirmAlert, messageAlert } from '../lib/sweetalerts'
import apiRequest from '../lib/axiosrequests'
import User, { emptyUser } from '../types/adopter'
import Select, { Option } from '../components/Select'
import userRoles from '../constants/user.constants'

type RequestParam = { url?: string, type?: string, name?: string, age?: string }

export const users = signal<User[]>([])
const user = signal<User>(emptyUser)
const modalOperation = signal('create')

const getUsers = () => apiRequest({ method: 'GET', url: '/users' })
    .then(res => users.value = res.data.collection)
    .catch(err => console.log(err))

const sendRequest = async (method: string, params: RequestParam) => {
    await apiRequest({ method, url: params.url, data: params })
        .then(res => {
            const { type, message } = res.data
            messageAlert(message, type)
            if (type === 'success') {
                document.getElementById('closeModalBtn')?.click()
                getUsers()
            }
        })
        .catch(err => messageAlert(`Error at request: ${err}`, 'error'))
}

const openUserModal = (operation: string, currentUser: User) =>
    batch(() => {
        modalOperation.value = operation
        user.value = currentUser
    })

effect(getUsers)

const UsersPage = () => {
    useSignals()

    return <>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-sm-4 offset-sm-4 d-grid mx-auto'>
                    <RegisterUserButton />
                </div>
            </div>
            <UsersTable />
        </div>
        <UsersModal />
    </>
}

const RegisterUserButton = () => {
    return <>
        <button
            className='btn btn-dark'
            data-bs-toggle='modal'
            data-bs-target='#usersModal'
            onClick={() => openUserModal('create', emptyUser)}
        >
            <Icon icon='circle-plus' /> Add User
        </button>
    </>
}

const UsersTable = () => <>
    <Table
        head={
            <tr>
                <th className='col-1'>ID</th>
                <th className='col-2'>NAME</th>
                <th className='col-2'>ADDRESS</th>
                <th className='col-2'>CONTACT</th>
                <th className='col-1'>ACTIONS</th>
            </tr>
        }
        body={
            users.value.map((userRow: User) =>
                <UserRow key={userRow.id} userRow={userRow} />
            )
        }
    />
</>

const UserRow: React.FC<{ userRow: User }> = ({ userRow }) => {

    const deleteUser = () =>
        sendRequest('DELETE', { url: `${URL}/delete/${userRow.id}` })
    const cancelDeletion = () =>
        messageAlert(`The user ${userRow.name} was not deleted`, `info`)

    const openDeleteUserModal = () => confirmAlert(
        `Do you want to delete the user ${userRow.name}?`,
        'The user will be deleted',
        deleteUser,
        cancelDeletion
    )

    return <>
        <tr>
            <th className='text-center'>{userRow.id}</th>
            <td>{userRow.role}</td>
            <td>{userRow.name}</td>
            <td>{userRow.email}</td>
            <td>{userRow.address}</td>
            <td className='text-center'>
                <ActionButton
                    icon='pen'
                    target='#usersModal'
                    onClick={() => openUserModal('update', userRow)}
                />
                <ActionButton
                    icon='trash'
                    onClick={openDeleteUserModal}
                />
            </td>
        </tr>
    </>
}

const UsersModal = () => {
    let currentUser = user.value

    const title = modalOperation.peek() === 'update'
        ? `Edit User ${user.peek().name}`
        : 'Register new User'

    const handleChange = (e: any) => currentUser = {
        ...currentUser,
        [e.target.name]: e.target.value.trim()
    }

    const userRoles2Options = () => {
        const options: Option[] = []
        for (const [key, value] of userRoles)
            options.push({ key, value })
        return options
    }

    const validate = () => {
        if (currentUser.role === '')
            return messageAlert('User role is required', 'error')
        if (currentUser.name === '')
            return messageAlert('User name is required', 'error')
        if (currentUser.email === '')
            return messageAlert('User email is required', 'error')
        if (currentUser.password === '')
            return messageAlert('User password is required', 'error')
        if (currentUser.address === '')
            return messageAlert('User address is required', 'error')

        let method = 'PUT'
        const request = {
            url: `${URL}/update/${currentUser.id}`,
            role: currentUser.name,
            name: currentUser.name,
            email: currentUser.name,
            password: currentUser.name,
            address: currentUser.name,
        }

        if (modalOperation.value === 'create') {
            request.url = `${URL}/create`
            method = 'POST'
        }
        sendRequest(method, request)
        user.value = currentUser
    }

    return <>
        <div id='usersModal' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5>
                            <Icon icon='children' style='me-2' />
                            {title}
                        </h5>
                    </div>
                    <div className='modal-body'>
                        <Select
                            name='role'
                            default='Select user role...'
                            placeholder='User role'
                            icon={<Icon icon='user-tie' />}
                            value={currentUser.role}
                            options={userRoles2Options()}
                            onChange={handleChange}
                        />
                        <Input
                            type='text'
                            name='name'
                            icon={<i className='fa-solid fa-signature' />}
                            placeholder='User name'
                            value={currentUser.name}
                            onChange={handleChange}
                        />
                        <Input
                            type='email'
                            name='email'
                            icon={<i className='mx-1 fa-solid fa-location-dot' />}
                            value={currentUser.email}
                            placeholder='Users email'
                            onChange={handleChange}
                        />
                        <Input
                            type='password'
                            name='password'
                            icon={<i className='ms-1 fa-solid fa-address-book' />}
                            placeholder='Users password'
                            value={currentUser.password}
                            onChange={handleChange}
                        />
                        <Input
                            type='text'
                            name='address'
                            icon={<i className='mx-1 fa-solid fa-location-dot' />}
                            value={currentUser.address}
                            placeholder='Users Address'
                            onChange={handleChange}
                        />
                        <div className='d-grid col-6 mx-auto'>
                            <button
                                className='btn btn-success'
                                onClick={validate}
                            >
                                <i className='fa-solid fa-floppy-disk' /> Save
                            </button>
                        </div>
                    </div>
                    <div className='modal-footer'>
                        <button
                            id='closeModalBtn'
                            type='button'
                            className='btn btn-secondary'
                            data-bs-dismiss='modal'
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default UsersPage