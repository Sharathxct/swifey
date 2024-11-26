import { Router } from 'express'
import { generateConfig, receiveProofs } from '../controller/reclaim'

const reclaim = Router()

//@ts-ignore
reclaim.get('/generate-config', generateConfig)

//@ts-ignore
reclaim.post('/receive-proofs', receiveProofs)

export default reclaim





