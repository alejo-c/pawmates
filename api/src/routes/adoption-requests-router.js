import express from 'express'
import * as controller from '../controllers/adoption-requests-controller.js'

const router = express.Router()

router.get('/', controller.readRequests)
router.get('/:id', controller.readRequest)
router.post('/register', controller.createRequest)
router.put('/update/:id', controller.updateRequest)
router.put('/approve/:id', controller.approveRequest)
router.put('/reject/:id', controller.rejectRequest)
router.delete('/delete/:id', controller.deleteRequest)

export { router as requestsRouter }







