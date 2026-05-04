import { Router } from 'express'
import ioc from '../config/ioc'

const router = Router()

// capture routes
router.post('/api/capture',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.generateMomentRequestValidator.validate(req, res, next),
    (req, res, next) => ioc.promptValidator.handle(req, res, next),
    (req, res, next) => ioc.sseMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.capture(req, res)
)

// moments routes
router.get('/api/moments',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.loadAll(req, res)
)

router.put('/api/moments/:id',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.updateMomentRequestValidator.validate(req, res, next),
    (req, res) => ioc.momentController.update(req, res)
)

router.get('/api/moments/check-slug',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.checkSlugRequestValidator.validate(req, res, next),
    (req, res) => ioc.momentController.checkSlug(req, res)
)

// invite keys routes
router.post('/api/invite-keys/validate',
    (req, res, next) => ioc.validateInviteKeyRequestValidator.validate(req, res, next),
    (req, res) => ioc.inviteKeyController.validate(req, res)
)

// healthcheck
router.get('/healthcheck', ioc.systemController.healthcheck)

// 404
router.use(ioc.systemController.notFound)

export default router
