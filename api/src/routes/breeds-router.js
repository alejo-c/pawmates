import express from 'express'
import * as controller from '../controllers/breeds-controller.js'

const router = express.Router()

router.get('/', controller.getBreeds)
router.get('/:id', controller.getBreed)
router.post('/register', controller.createBreed)
router.put('/update/:id', controller.updateBreed)
router.delete('/delete/:id', controller.removeBreed)

export { router as breedsRouter }