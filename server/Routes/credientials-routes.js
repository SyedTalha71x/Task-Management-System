import { registerAdmin, registerManager, registerUser, login } from "../Controllers /credientials-controller.js";
import express from 'express'

const router = express.Router();

router.post('/register-admin', registerAdmin)
router.post('/register-manager', registerManager)
router.post('/register-user', registerUser)
router.post('/login', login)


export default router