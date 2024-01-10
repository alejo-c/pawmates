import { effect, signal } from '@preact/signals-react'
import { useSignals } from '@preact/signals-react/runtime'
import { Link } from 'react-router-dom'

import Pet, { emptyPet } from '../types/pet'
import { localhostURL as URL } from '../constants/api.constants'
import petTypes, { petGenders } from '../constants/pet.constants'
import Icon from '../components/Icon'
import LoadingSpinner from '../components/LoadingSpinner'
import apiRequest from '../lib/axiosrequests'

const pets = signal<Pet[]>([])
const adoptedPet = signal<Pet>(emptyPet)

const getData = () =>
    apiRequest({ method: 'GET', url: `${URL}/pets` })
        .then(res => pets.value = res.data.collection)
        .catch(err => console.log(err))

effect(getData)

const HomePage = () => {
    useSignals()

    if (pets.value.length === 0) return <LoadingSpinner />

    return <>
        <div className='row m-0 mt-5 col-12'>
            {
                pets.value
                    .filter(pet => pet.adoption_status === '1')
                    .map(pet => <PetCard key={pet.id} pet={pet} />)
            }
        </div>
    </>
}

const PetCard = ({ pet }: { pet: Pet }) => {
    const type = petTypes.get(pet.type)?.toLowerCase()
    const genderIcon = petGenders.get(pet.gender)?.icon

    const adoptPet = () => {
        adoptedPet.value = pet
    }

    return <>
        <div className='col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3'>
            <div className='card p-0 mb-3'>
                <img src={pet.photo_url} className='card-img-top' alt={pet.name} />
                <div className='card-body'>
                    <h5 className='card-title'>
                        <Icon icon={`${type}`} />
                        <span className='mx-2'>{pet.name}</span>
                        <Icon icon={`${genderIcon}`} />
                    </h5>
                    <div className='card-text'>
                        <div>
                            <strong>Breed:</strong>
                            <span className='ms-1 text-capitalize'>
                                {pet.breed.name}
                            </span>
                        </div>
                        <div>
                            <strong>Age:</strong>
                            <span className='ms-1'>{pet.age} years old</span>
                        </div>
                        <small>
                            {pet.description}
                        </small>
                    </div>
                    <div className='text-center buttons'>
                        <Link key={pet.id} to={`/adoptpet/${pet.id}`}>
                            <button className='btn btn-primary'>
                                <Icon icon='circle-info' style='me-1' />
                                Details
                            </button>
                        </Link>
                        <button
                            className='btn btn-success ms-2'
                            onClick={adoptPet}
                        >
                            <Icon icon='file-pen' style='me-1' />
                            Adopt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default HomePage