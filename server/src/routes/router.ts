import { Router } from 'express'
import ioc from '../config/ioc'

const router = Router()

// capture routes
router.post('/capture',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.momentLimitMiddleware.handle(req, res, next),
    (req, res, next) => ioc.generationGuardMiddleware.handle(req, res, next),
    (req, res, next) => ioc.generateMomentRequestValidator.validate(req, res, next),
    (req, res, next) => ioc.promptValidator.handle(req, res, next),
    (req, res, next) => ioc.promptModerationMiddleware.handle(req, res, next),
    (req, res, next) => ioc.promptClassifierMiddleware.handle(req, res, next),
    (req, res, next) => ioc.sseMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.capture(req, res)
)

router.get('/capture/resume',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.sseMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.resume(req, res)
)

// moments routes
router.get('/moments',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.loadAll(req, res)
)

router.get('/moments/:slug',
    (req, res) => ioc.momentController.loadPublishedBySlug(req, res)
)

router.put('/moments/:id',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.updateMomentRequestValidator.validate(req, res, next),
    (req, res) => ioc.momentController.update(req, res)
)

router.post('/moments/:slug/submissions',
    (req, res, next) => ioc.submitFormDataRequestValidator.validate(req, res, next),
    (req, res) => ioc.formSubmissionController.store(req, res)
)

router.get('/moments/:slug/submissions',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.downloadFormSubmissionsMiddleware.handle(req, res, next),
    (req, res) => ioc.formSubmissionController.download(req, res)
)

// invite keys routes
router.post('/invite-keys/validate',
    (req, res, next) => ioc.rateLimiterMiddleware.handle(req, res, next),
    (req, res, next) => ioc.validateInviteKeyRequestValidator.validate(req, res, next),
    (req, res) => ioc.inviteKeyController.validate(req, res)
)

// image upload route
router.post('/images',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.uploadMiddleware.handle(req, res, next),
    (req, res) => ioc.imageController.upload(req, res)
)

// healthcheck
router.get('/healthcheck', ioc.systemController.healthcheck)

// 404
router.use(ioc.systemController.notFound)

export default router
