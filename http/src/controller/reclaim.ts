import { Request, Response } from "express";
import { User } from "../models/user";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";

const generateConfig = async (_req: Request, res: Response) => {
  const APP_ID = '0xf6fB7a7B4065011777b55F2332c6CF0B17e5e6C3';
  const APP_SECRET = '0xaf3f96aba9bf9062b2e4c547f9e918febb9fdc4c9b5cf5a06b97e45f2647aaed';
  const PROVIDER_ID = '5e1302ca-a3dd-4ef8-bc25-24fcc97dc800';

  console.log("generateConfig")

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)

    reclaimProofRequest.setAppCallbackUrl('http://localhost:3000/api/reclaim/receive-proofs')

    const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()

    return res.json({ reclaimProofRequestConfig })
  } catch (error) {
    console.error('Error generating request config:', error)
    return res.status(500).json({ error: 'Failed to generate request config' })
  }
}

const receiveProofs = async (req: Request, res: Response) => {
  console.log("receiveProofs")
  const proofs = req.body
  console.log('Received proofs:', proofs)
  // Process the proofs here
  return res.sendStatus(200)
}

export {
  generateConfig,
  receiveProofs
}
