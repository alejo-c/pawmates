import { Breed, getBreedById } from '../models/breed-model.js'

export const createBreed = async (req, res) => {
    if (req.body.name === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The breed name is required'
    })
    if (req.body.description === undefined) return res.status(400).jsonPretty({
        type: 'error',
        message: 'The breed description is required'
    })

    const breed = await Breed.create(req.body)
    res.status(201).jsonPretty({
        type: 'success',
        message: `Breed ${name} created successfully`,
        created: breed
    })
}

export const getBreeds = async (req, res) => {
    const breeds = await Breed.findAll()
    const length = breeds.length

    if (length === 0) return res.status(500).jsonPretty({
        type: 'error',
        message: 'There is no breeds',
        length
    })
    res.status(200).jsonPretty({ collection: breeds, length })
}

export const getBreedsNames = async (req, res) => {
    const breeds = await Breed.findAll({ attributes: ['id', 'name'] })
    const length = breeds.length

    if (length === 0) return res.status(500).jsonPretty({
        type: 'error',
        message: 'There is no breeds',
        length
    })
    res.status(200).jsonPretty({ collection: breeds, length })
}

export const getBreed = async (req, res) => {
    const id = req.params.id
    const breed = await getBreedById(id)

    if (breed === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Breed with id ${id} not found`
    })
    res.status(200).jsonPretty({ object: breed })
}

export const updateBreed = async (req, res) => {
    const id = req.params.id
    const { name, description } = req.body

    const breed = await getBreedById(id)
    if (breed === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Breed with id ${id} not found`
    })

    const isInvalidData = name === undefined && description === undefined
    if (isInvalidData) return res.status(400).jsonPretty({
        type: 'error',
        message: 'There is no valid data for update'
    })

    breed.update(req.body)
    res.status(200).jsonPretty({
        type: 'successj',
        message: `Breed ${name} (id: ${id}) updated successfully`,
        updated: breed
    })

}

export const removeBreed = async (req, res) => {
    const id = req.params.id
    const breed = await getBreedById(id)

    if (breed === null) return res.status(404).jsonPretty({
        type: 'error',
        message: `Breed with id ${id} not found`
    })

    breed.destroy()
    res.status(200).jsonPretty({
        type: 'success',
        message: `Breed (id: ${id}) deleted successfully`,
        deleted: breed
    })
}
