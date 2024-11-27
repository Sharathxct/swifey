import { Request, Response } from "express";
import { User } from "../models/user";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import Graphdb from "../db";

const generateConfig = async (_req: Request, res: Response) => {
  const APP_ID = '0xf6fB7a7B4065011777b55F2332c6CF0B17e5e6C3';
  const APP_SECRET = '0xaf3f96aba9bf9062b2e4c547f9e918febb9fdc4c9b5cf5a06b97e45f2647aaed';
  const PROVIDER_ID = 'b16c6781-4411-4bde-b1e6-c041df573f96';

  console.log("generateConfig")

  try {
    const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)

    reclaimProofRequest.setAppCallbackUrl('http://192.168.1.210:3000/api/reclaim/receive-proofs')

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

const proofs = async (req: Request, res: Response) => {
  //@ts-ignore
  console.log(req.user.userId)
  const { proof } = req.body;
  console.log('Received proofs:', proof)
  // Process the proofs here
  if (!proof) {
    return res.status(400).send("Bad request");
  }
  try {
    //@ts-ignore
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).send("User not found");
    }
    user.isVerified = true;
    user.save();
    await Graphdb.verifyUser(user._id.toString());
    res.send("verified");
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "server error" })
  }
  return res.sendStatus(400)
}

export {
  generateConfig,
  receiveProofs,
  proofs
}
