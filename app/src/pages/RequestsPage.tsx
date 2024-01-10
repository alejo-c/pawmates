import { useSignals } from '@preact/signals-react/runtime'
import { batch, effect, signal } from '@preact/signals-react'
import { AxiosResponse } from 'axios'

import petTypes from '../constants/pet.constants'
import adoptionStatuses from '../constants/request.constants'
import { confirmAlert, messageAlert } from '../lib/sweetalerts'
import apiRequest from '../lib/axiosrequests'
import AdoptionRequest, { emptyRequest } from '../types/adoptionrequest'
import Pet, { emptyPet } from '../types/pet'
import User, { emptyUser } from '../types/adopter'

import ActionButton from '../components/ActionButton'
import Icon from '../components/Icon'
import Select from '../components/Select'
import Table from '../components/Table'

type RequestParam = { url?: string, pet_id?: number, adoption_id?: number }

const requests = signal<AdoptionRequest[]>([])
const pets = signal<Pet[]>([])
const users = signal<User[]>([])

const request = signal<AdoptionRequest>(emptyRequest)
const modalOperation = signal('create')

const getData = () => {
    apiRequest({ method: 'GET', url: '/adoption-requests' })
        .then(res => requests.value = res.data.collection)
        .catch(err => console.log(err))

    apiRequest({ method: 'GET', url: '/pets' })
        .then(res => pets.value = res.data.collection)
        .catch(err => console.log(err))

    apiRequest({ method: 'GET', url: '/users' })
        .then(res => users.value = res.data.collection)
        .catch(err => console.log(err))
}

const success = (res: AxiosResponse) => {
    const { type, message } = res.data
    messageAlert(message, type)

    document.getElementById('closeModalBtn')?.click()
    if (type === 'success')
        getData()
}

const sendRequest = (method: string, params: RequestParam) => {
    apiRequest({ method, url: '/adoption-requests', data: params })
        .then(success)
        .catch(err => messageAlert(`Error at request: ${err}`, 'error'))
}

const openRequestModal = (operation: string, currentRequest: AdoptionRequest) =>
    batch(() => {
        modalOperation.value = operation
        request.value = currentRequest
    })

const getPet = (pet_id: number) => {
    const pet = pets.value.find(pet => pet.id === pet_id)
    return pet === undefined ? emptyPet : pet
}

const getAdopter = (adopter_id: number) => {
    const adopter = users.value.find(adopter => adopter.id === adopter_id)
    return adopter === undefined ? emptyUser : adopter
}

effect(getData)

const RequestsPage = () => {
    useSignals()
    return <>
        <div className='container-fluid'>
            <div className='row mt-3 col-sm-4 offset-sm-4 d-grid mx-auto'>
                <RegisterRequestButton />
            </div>
            <RequestsTable />
        </div>
        <RequestsModal />
    </>
}

const RegisterRequestButton = () => {
    return <>
        <button
            className='btn btn-dark'
            data-bs-toggle='modal'
            data-bs-target='#requestsModal'
            onClick={() => openRequestModal('create', emptyRequest)}
        >
            <Icon icon='circle-plus' /> Make Request
        </button>
    </>
}

const RequestsTable = () => <>
    <Table
        head={
            <tr>
                <th className='col-1'>ID</th>
                <th className='col-2'>PET</th>
                <th className='col-2'>ADOPTER</th>
                <th className='col-1'>STATE</th>
                <th className='col-2'>ACTIONS</th>
            </tr>
        }
        body={
            requests.value.map((requestRow: AdoptionRequest) =>
                <RequestRow key={requestRow.id} requestRow={requestRow} />
            )
        }
    />
</>

const RequestRow: React.FC<{ requestRow: AdoptionRequest }> = ({ requestRow }) => {
    const pet: Pet = getPet(requestRow.pet_id)
    const adopter: User = getAdopter(requestRow.adopter_id)

    const type = petTypes.get(pet.type)
    const { status, badge } = { ...adoptionStatuses.get(requestRow.status) }

    const approveRequest = () =>
        sendRequest('PUT', { url: `${URL}/approve/${requestRow.id}` })
    const rejectRequest = () =>
        sendRequest('PUT', { url: `${URL}/reject/${requestRow.id}` })
    const deleteRequest = () =>
        sendRequest('DELETE', { url: `${URL}/delete/${requestRow.id}` })

    const cancelDeletion = () =>
        messageAlert(`The request ${requestRow.id} was not deleted`, `info`)

    const openDeleteRequestModal = () => confirmAlert(
        `Do you want to delete the request ${requestRow.id}?`,
        'The request will be deleted',
        deleteRequest,
        cancelDeletion
    )

    return <>
        <tr className='text-nowrap'>
            <th className='text-center'>{requestRow.id}</th>
            <td>
                <Icon icon={`${type?.toLocaleLowerCase()}`} style='me-1' />
                {pet.name}
            </td>
            <td>{adopter.name}</td>
            <td className='text-center'>
                <span className={`badge rounded-pill text-bg-${badge}`}>{status}</span>
            </td>
            <td className='text-center'>
                <ActionButton
                    icon='check'
                    disabled={status !== 'In Process'}
                    onClick={approveRequest}
                />
                <ActionButton
                    icon='xmark'
                    disabled={status === 'Rejected'}
                    onClick={rejectRequest}
                />
                <ActionButton
                    icon='pencil'
                    disabled={status !== 'In Process'}
                    target='#requestsModal'
                    onClick={() => openRequestModal('update', requestRow)}
                />
                <ActionButton
                    icon='trash'
                    onClick={openDeleteRequestModal}
                />
            </td>
        </tr>
    </>
}

const RequestsModal = () => {
    const title = modalOperation.value === 'update'
        ? `Edit Request ${request.value.id}`
        : 'Register new Request'

    const validate = () => {
        if (request.value.pet_id === 0)
            return messageAlert('Pet ID is required', 'error')
        if (request.value.adopter_id === 0)
            return messageAlert('Adopter ID is required', 'error')

        let method = 'PUT'
        const req = {
            url: `${URL}/update/${request.value.id}`,
            pet_id: request.value.pet_id,
            adopter_id: request.value.adopter_id,
        }

        if (modalOperation.value === 'create') {
            req.url = `${URL}/create`
            method = 'POST'
        }
        sendRequest(method, req)
    }

    const handleChange = (e: any) => request.value = {
        ...request.value,
        [e.target.name]: e.target.value.trim()
    }

    const pets2Options = () => {
        let petOptions = pets.value
            .filter(pet => pet.adoption_status === '1')
            .map(pet => ({ key: pet.id, value: `${petTypes.get(pet.type)} ${pet.name}` }))

        const currentPet = getPet(request.value.pet_id)
        const isOption = petOptions.find(pet => currentPet.id === pet.key) !== undefined

        if (currentPet !== emptyPet && !isOption)
            petOptions = [
                { key: currentPet.id, value: `${petTypes.get(currentPet.type)} ${currentPet.name}` },
                ...petOptions,
            ]
        return petOptions
    }
    const adopters2Options = () =>
        users.value.map(user => ({ key: user.id, value: `${user.name} - ${user.email}` }))

    return <>
        <div id='requestsModal' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'><h5>{title}</h5></div>
                    <div className='modal-body'>
                        <Select
                            name='pet_id'
                            default='Select Pet...'
                            placeholder='Pet'
                            icon={<Icon icon='paw' />}
                            value={request.value.pet_id}
                            options={pets2Options()}
                            onChange={handleChange}
                        />
                        <Select
                            name='adopter_id'
                            default='Select Adopter...'
                            placeholder='Adopter'
                            icon={<Icon icon='person' style='mx-1' />}
                            value={request.value.adopter_id}
                            options={adopters2Options()}
                            onChange={handleChange}
                        />
                        <div className='d-grid col-6 mx-auto'>
                            <button
                                className='btn btn-success'
                                onClick={validate}
                            >
                                <Icon icon='floppy-disk' /> Save
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

export default RequestsPage