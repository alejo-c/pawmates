import Breed, { emptyBreed } from './breed'

type Pet = {
    id: number
    type: string
    name: string
    gender: string
    age: number
    breed: Breed
    photo_url: string
    description: string
    adoption_status: string
}

export const emptyPet: Pet = {
    id: 0,
    type: '',
    name: '',
    gender: '',
    age: 0,
    breed: emptyBreed,
    photo_url: '',
    description: '',
    adoption_status: ''
}

export default Pet