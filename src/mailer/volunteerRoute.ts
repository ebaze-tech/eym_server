import express from "express"
import { volunteerMail } from "./volunteerMailer"

export const router = express.Router()

router.post("/volunteer", volunteerMail)