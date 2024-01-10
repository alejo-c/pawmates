import { AdoptionRequest, getRequestById } from '../models/adoption-request-model.js'
import { getPetById } from '../models/pet-model.js'
import { getUserById } from '../models/user-model.js'

export const createRequest = async (req, res) => {
    const { status, ...body } = req.body
    const petId = body.pet_id
    const userId = body.user_id

    if (petId === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The pet id is required'
    })
    if (userId === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The user id is required'
    })

    const pet = await getPetById(petId)
    if (pet === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Pet with id ${petId} not found`
    })

    const user = await getUserById(userId)
    if (user === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `User with id ${userId} not found`
    })

    const request = await AdoptionRequest.create(body)
    pet.update({ adoption_status: '2' })

    res.status(201).jsonPretty({
        type: 'success',
        message: `Adoption request with id ${request.id} created successfully`,
        created: request
    })
}

export const readRequests = async (req, res) => {
    let requests = await AdoptionRequest.findAll()
    const length = requests.length

    if (length === 0) return res.status(500).jsonPretty({
        type: 'error',
        message: 'There is no adoption requests',
        length
    })

    requests = await Promise.all(requests.map(async request => {
        const pet = await getPetById(request.pet_id)
        const user = await getUserById(request.user_id)
        return { ...request.dataValues, pet, user }
    }))

    res.status(200).jsonPretty({ collection: requests, length })
}

export const readRequest = async (req, res) => {
    const id = req.params.id
    let request = await getRequestById(id)

    if (request === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Adoption request with id ${id} not found`
    })

    const pet = await getPetById(request.pet_id)
    const user = await getUserById(request.user_id)
    request = { ...request.dataValues, pet, user }

    res.status(200).jsonPretty({ object: request })
}

export const updateRequest = async (req, res) => {
    const id = req.params.id
    const { status, ...body } = req.body

    const isInvalidData = body.pet_id === undefined && body.user_id === undefined
    if (isInvalidData) return res.status(400).jsonPretty({
        type: 'error',
        message: 'There is not valid data for update'
    })

    const request = await getRequestById(id)
    if (request === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Adoption request with id ${id} was not found`
    })

    request.update(body)
    res.status(200).jsonPretty({
        type: 'success',
        message: `Adoption request with id ${id} updated successfully`,
        updated: request
    })
}

export const approveRequest = async (req, res) => {
    const id = req.params.id
    const request = await getRequestById(id)

    if (request === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Adoption request with id ${id} was not found`
    })

    const pet = await getPetById(request.pet_id)
    pet.update({ adoption_status: '3' })
    request.update({ status: '4' })

    res.status(200).jsonPretty({
        type: 'success',
        message: `Adoption request with id ${id} approved successfully`,
        object: request
    })
}

export const rejectRequest = async (req, res) => {
    const id = req.params.id

    const request = await getRequestById(id)
    if (request === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Adoption request with id ${id} was not found`
    })

    const pet = await getPetById(request.pet_id)
    pet.update({ adoption_status: '1' })
    request.update({ status: '5' })

    res.status(200).jsonPretty({
        type: 'success',
        message: `Adoption request with id ${id} rejected successfully`,
        object: request
    })
}

export const deleteRequest = async (req, res) => {
    const id = req.params.id
    const request = await getRequestById(id)

    if (request === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Adoption request [${id}] was not found`
    })

    request.destroy()
    res.status(200).jsonPretty({
        type: 'success',
        message: `Adoption request [${id}] deleted successfully`,
        deleted: request
    })
}