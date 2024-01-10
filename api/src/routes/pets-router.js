import express from 'express'
import * as controller from '../controllers/pets-controller.js'

const router = express.Router()

router.get('/', controller.readPets)
router.get('/:id', controller.readPet)
router.post('/register', controller.createPet)
router.put('/update/:id', controller.updatePet)
router.delete('/delete/:id', controller.removePet)

export { router as petsRouter }