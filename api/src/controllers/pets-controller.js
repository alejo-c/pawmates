import { getBreedById } from '../models/breed-model.js'
import { Pet, petTypes, getPetById, petGenders } from '../models/pet-model.js'

export const createPet = async (req, res) => {
    const { adoption_status, ...body } = req.body

    if (body.type === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet type is required'
    })
    if (body.name === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet name is required'
    })
    if (body.gender === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet gender is required'
    })
    if (body.photo_url === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet photo is required'
    })
    if (body.description === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet description is required'
    })

    const type = petTypes[pet.type]
    if (type === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet type is not valid'
    })

    const gender = petGenders[pet.gender]
    if (gender === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet gender is not valid'
    })

    const pet = await Pet.create(body)
    res.status(201).jsonPretty({
        type: 'success',
        message: `${gender} ${type} ${pet.name} (id: ${pet.id}) created successfully`,
        created: pet
    })
}

export const readPets = async (req, res) => {
    let pets = await Pet.findAll()
    const length = pets.length

    if (length === 0) return res.status(500).jsonPretty({
        type: 'error',
        message: 'There is no pets',
        length
    })

    pets = await Promise.all(pets.map(async pet => {
        const breed = await getBreedById(pet.breed)
        return { ...pet.dataValues, breed }
    }))
    res.status(200).jsonPretty({ collection: pets, length })
}

export const readPet = async (req, res) => {
    const id = req.params.id
    let pet = await getPetById(id)

    if (pet === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Pet with id ${id} not found`
    })

    const breed = await getBreedById(pet.breed)
    pet = { ...pet.dataValues, breed }

    res.status(200).jsonPretty({ object: pet })
}

export const updatePet = async (req, res) => {
    const id = req.params.id
    const { adoption_status, ...body } = req.body

    let pet = await getPetById(id)
    if (pet === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Pet with id ${id} does not exists`
    })

    const isInvalidData = body.type === undefined
        && body.name === undefined
        && body.gender === undefined
        && body.age === undefined
        && body.photo === undefined
        && body.description === undefined
    if (isInvalidData) return res.status(400).jsonPretty({
        type: 'error',
        message: 'There is not valid data for update'
    })

    const type = petTypes[pet.type]
    const isInvalidType = body.type !== undefined && type === undefined
    if (isInvalidType) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet type is not valid'
    })

    const gender = petGenders[pet.gender]
    const isInvalidGender = body.gender !== undefined && gender === undefined
    if (isInvalidGender) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet gender is not valid'
    })

    pet.update(body)
    res.status(200).jsonPretty({
        type: 'success',
        message: `${gender} ${type} ${pet.name} (id: ${id}) updated successfully`,
        updated: pet
    })
}

export const removePet = async (req, res) => {
    const id = req.params.id
    let pet = await getPetById(id)

    if (pet === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Pet with id ${id} does not exists`
    })

    pet.destroy()
    const type = petTypes[pet.type]
    const gender = petGenders[pet.gender]

    res.status(200).jsonPretty({
        type: 'success',
        message: `${gender} ${type} ${pet.name} (id: ${id}) deleted successfully`,
        deleted: pet
    })
}
