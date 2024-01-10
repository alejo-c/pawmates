import { useSignals } from '@preact/signals-react/runtime'
import { batch, effect, signal } from '@preact/signals-react'
import Icon from '../components/Icon'
import Input from '../components/Input'
import Select, { Option } from '../components/Select'
import Table from '../components/Table'
import ActionButton from '../components/ActionButton'
import { confirmAlert, messageAlert } from '../lib/sweetalerts'
import petTypes, { petGenders } from '../constants/pet.constants'
import adoptionStatuses from '../constants/request.constants'
import apiRequest from '../lib/axiosrequests'
import Pet, { emptyPet } from '../types/pet'
import { AxiosRequestConfig } from 'axios'

const pets = signal<Pet[]>([])
const pet = signal<Pet>(emptyPet)
const modalOperation = signal('create')

const getPets = () => apiRequest({ method: 'GET', url: '/pets' })
    .then(res => pets.value = res.data.collection)
    .catch(err => console.log(err))

const closeModal = () => document.getElementById('closeModalBtn')?.click()

const sendRequest = async (config: AxiosRequestConfig<any>) => {
    await apiRequest(config).then(res => {
        const { type, message } = res.data

        messageAlert(message, type)
        if (type === 'success') {
            closeModal()
            getPets()
        }

    }).catch(err => messageAlert(`Error at request: ${err}`, 'error'))
}

const openPetModal = (operation: string, currentPet: Pet) =>
    batch(() => {
        modalOperation.value = operation
        pet.value = currentPet
    })

effect(getPets)

const PetsPage = () => {
    useSignals()
    return <>
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className='col-sm-4 offset-sm-4 d-grid mx-auto'>
                    <RegisterPetButton />
                </div>
            </div>
            <PetsTable />
        </div>
        <PetsModal />
    </>
}

const RegisterPetButton = () => <>
    <button
        className='btn btn-dark'
        data-bs-toggle='modal'
        data-bs-target='#petsModal'
        onClick={() => openPetModal('create', emptyPet)}
    >
        <Icon icon='circle-plus' /> Add Pet
    </button>
</>

const PetsTable = () => <>
    <Table
        head={
            <tr>
                <th className='col-1'>ID</th>
                <th className='col-1'>TYPE</th>
                <th className='col-1'>BREED</th>
                <th className='col-1'>GENDER</th>
                <th className='col-1'>NAME</th>
                <th className='col-1'>AGE (y/o)</th>
                <th className='col-1'>STATE</th>
                <th className='col-1'>ACTIONS</th>
            </tr>
        }
        body={
            pets.value.map((petRow: Pet) => <PetRow key={petRow.id} petRow={petRow} />)
        }
        colSpan={8}
    />
</>

const PetRow: React.FC<{ petRow: Pet }> = ({ petRow }) => {
    const type = petTypes.get(petRow.type)?.toLowerCase()
    const { gender, icon: genderIcon } = { ...petGenders.get(petRow.gender) }
    const { status, badge } = { ...adoptionStatuses.get(petRow.adoption_status) }

    const deletePet = () =>
        sendRequest({ method: 'DELETE', url: `${URL}/delete/${petRow.id}` })
    const cancelDeletion = () =>
        messageAlert(`The ${type} ${petRow.name} was not deleted`, `info`)

    const openDeletePetModal = () => confirmAlert(
        `Do you want to delete the ${type} ${petRow.name}?`,
        'The pet will be deleted',
        deletePet,
        cancelDeletion
    )

    return <>
        <tr className='text-center'>
            <th>{petRow.id}</th>
            <td className='text-start text-capitalize'>
                <Icon icon={`${type}`} style='me-1 d-none d-sm-inline' />
                {type}
            </td>
            <td className='text-start text-capitalize'>{petRow.breed.name}</td>
            <td className='text-start'>
                <Icon icon={`${genderIcon}`} style='me-1' />
                {gender}
            </td>
            <td className='text-start'>{petRow.name}</td>
            <td>{petRow.age}</td>
            <td>
                <span className={`badge rounded-pill text-bg-${badge}`}>{status}</span>
            </td>
            <td>
                <ActionButton
                    icon='pen'
                    target='#petsModal'
                    onClick={() => openPetModal('update', petRow)}
                />
                <ActionButton
                    icon='trash'
                    onClick={openDeletePetModal}
                />
            </td>
        </tr>
    </>
}

const PetsModal = () => {
    let currentPet: Pet = pet.value
    const type = petTypes.get(currentPet.type)
    const name = currentPet.name

    const title = modalOperation.value === 'update'
        ? <>
            <Icon icon={`${type?.toLowerCase()}`} style='me-2' />
            Edit {type} {name}
        </>
        : <>
            <Icon icon='paw' style='me-2' />
            Register new Pet
        </>

    const handleChange = (e: any) => {
        console.log('name:', e.target.name, ', value:', e.target.value)
        currentPet = {
            ...currentPet,
            [e.target.name]: e.target.value.trim()
        }
        console.log('current pet: ', currentPet)
    }

    const validate = () => {
        if (currentPet.type === '')
            return messageAlert('Type is required', 'error')
        if (currentPet.name === '')
            return messageAlert('Name is required', 'error')
        if (currentPet.age === 0)
            return messageAlert('Age is required', 'error')

        const req = {
            method: 'PUT',
            url: `/pets/update/${currentPet.id}`,
            data: {
                type: currentPet.type,
                name: currentPet.name,
                age: currentPet.age
            }
        }

        if (modalOperation.value === 'create') {
            req.url = `${URL}/create`
            req.method = 'POST'
        }

        pet.value = currentPet
        sendRequest(req)
    }

    const petTypes2Options = () => {
        const options: Option[] = []
        for (const [key, value] of petTypes)
            options.push({ key, value })
        return options
    }

    return <>
        <div id='petsModal' className='modal fade' aria-hidden='true'>
            <div className='modal-dialog'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h5>{title}</h5>
                    </div>
                    <div className='modal-body'>
                        <Select
                            name='type'
                            default='Select Type...'
                            placeholder='Pet type'
                            icon={<Icon icon='paw' style='me-1' />}
                            value={currentPet.type}
                            options={petTypes2Options()}
                            onChange={handleChange}
                        />
                        <Input
                            type='text'
                            name='name'
                            placeholder='Pet Name'
                            icon={<Icon icon='signature' />}
                            value={currentPet.name}
                            onChange={handleChange}
                        />
                        <Input
                            type='number'
                            name='age'
                            placeholder='Pet Age y/o'
                            icon={<Icon icon='calendar-day' style='mx-1' />}
                            value={currentPet.age}
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

export default PetsPage