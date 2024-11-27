import { Router } from 'express'
import { generateConfig, receiveProofs, proofs } from '../controller/reclaim'
import { auth } from '../middleware/auth'

const reclaim = Router()

//@ts-ignore
reclaim.get('/generate-config', generateConfig)

//@ts-ignore
reclaim.post('/receive-proofs', receiveProofs)

//@ts-ignore
reclaim.post('/proofs', auth, proofs)
export default reclaim





