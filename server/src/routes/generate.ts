import { Router } from 'express'
import PromptValidator from '../middlewares/PromptValidator'
import MomentController from '../controllers/MomentController'

const router = Router()
const promptValidator = new PromptValidator()
const momentController = new MomentController()

router.post(
    '/',
    (req, res, next) => promptValidator.handle(req, res, next),
    (req, res) => momentController.generate(req, res)
)

export default router
