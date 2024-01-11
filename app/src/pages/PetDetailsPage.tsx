import { effect, signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { Link, Navigate, useParams } from 'react-router-dom'

import { emptyPet } from '../types/pet'
import petTypes, { petGenders } from '../constants/pet.constants'
import adoptionStatuses from '../constants/request.constants'
import { localhostURL as URL } from '../constants/api.constants'
import Icon from '../components/Icon'
import LoadingSpinner from '../components/LoadingSpinner'
import apiRequest from '../lib/axiosrequests'
import NotFoundPage from './NotFoundPage'
import User from '../types/user'
import getLogged from '../lib/session'

const pet = signal(emptyPet)
const petId = signal('')
const error = signal('')
const loggedUser = signal<User | null>(null)

const getData = async () => {
    pet.value = emptyPet
    if (petId.value === '') return

    apiRequest({ method: 'GET', url: `${URL}/pets/${petId.value}` })
        .then(res => pet.value = res.data.object)
        .catch(err => error.value = err.code)
}

effect(getData)
effect(() => loggedUser.value = getLogged())

const PetDetailsPage = () => {
    useSignals()

    if (loggedUser.value === null) return <Navigate to='/login' />

    const { id } = useParams()
    petId.value = id!

    if (error.value === 'ERR_BAD_REQUEST') return <NotFoundPage />
    if (pet.value === emptyPet) return <LoadingSpinner />

    const type = petTypes.get(pet.value.type)?.toLowerCase()
    const gender = petGenders.get(pet.value.gender)?.gender
    const { status, badge } = { ...adoptionStatuses.get(pet.value.adoption_status) }
    const badgeStyle = `badge ms-2 fs-6 rounded-pill text-bg-${badge}`

    const adoptPet = () => {
        apiRequest({
            method: 'POST',
            url: '/adoption-requests/register',
            data: { pet_id: pet.value.id, user_id: 1 }
        })
            .then(res => pet.value = res.data.object)
            .catch(err => console.log(err))
    }

    return <>
        <div className='m-md-5 m-1 mt-5'>
            <div className='card'>
                <div className='card-header'>
                    <Link to='/'>
                        <Icon icon='chevron-left position-absolute fs-1' />
                    </Link>
                    <h2 className='m-auto d-flex justify-content-center align-items-center'>
                        <Icon icon={`${type}`} />
                        <span className='mx-2'>{pet.value.name}</span>
                        <span className={badgeStyle}>{status}</span>
                    </h2>
                </div>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <img
                                src={pet.value.photo_url}
                                className='img-fluid'
                                alt={pet.value.name}
                            />
                        </div>
                        <div className='col-md-8'>
                            <p>
                                {gender} {pet.value.breed.name}. {pet.value.description}
                            </p>

                            <strong className='me-1'>Age:</strong>
                            {pet.value.age} years old

                            <div className='buttons'>
                                <button
                                    className='btn btn-outline-info mt-2'
                                    disabled={status !== 'Available'}
                                    onClick={adoptPet}
                                >
                                    <Icon icon='file-pen' style='me-1' />
                                    Adopt {pet.value.name}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card'>
                <div className='card-body'>
                    <h2 className='card-title text-capitalize'>
                        {pet.value.breed.name}
                    </h2>
                    <p>{pet.value.breed.description}</p>
                </div>
            </div>
        </div>
    </>
}

export default PetDetailsPage