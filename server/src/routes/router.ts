import { Router } from 'express'
import ioc from '../config/ioc'

const router = Router()

// capture routes
router.post('/capture',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.momentLimitMiddleware.handle(req, res, next),
    (req, res, next) => ioc.generationGuardMiddleware.handle(req, res, next),
    (req, res, next) => ioc.generateMomentRequestValidator.validate(req, res, next),
    (req, res, next) => ioc.promptSanitizeMiddleware.handle(req, res, next),
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

router.get('/moments/check-slug',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.checkSlugRequestValidator.validate(req, res, next),
    (req, res) => ioc.momentController.checkSlug(req, res)
)

router.get('/moments/:slug',
    (req, res) => ioc.momentController.loadPublishedBySlug(req, res)
)

router.put('/moments/:id',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.updateMomentRequestValidator.validate(req, res, next),
    (req, res) => ioc.momentController.update(req, res)
)

router.patch('/moments/:id',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.momentOwnerShipMiddleware.handle(req, res, next),
    (req, res, next) => ioc.changeLimitMiddleware.handle(req, res, next),
    (req, res, next) => ioc.generationGuardMiddleware.handle(req, res, next),
    (req, res, next) => ioc.patchMomentRequestValidator.validate(req, res, next),
    (req, res, next) => ioc.promptSanitizeMiddleware.handle(req, res, next),
    (req, res, next) => ioc.promptModerationMiddleware.handle(req, res, next),
    (req, res, next) => ioc.sseMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.patch(req, res)
)

router.get('/moments/:id/changes',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res) => ioc.momentController.loadChanges(req, res)
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
router.get('/invite-keys/generate',
    (req, res, next) => ioc.rateLimiterMiddleware.handle(req, res, next),
    (req, res) => ioc.inviteKeyController.generate(req, res)
)

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

// feedbacks routes
router.post('/feedbacks',
    (req, res, next) => ioc.inviteKeyMiddleware.handle(req, res, next),
    (req, res, next) => ioc.submitFeedbackRequestValidator.validate(req, res, next),
    (req, res) => ioc.feedbackController.store(req, res),
)

// healthcheck
router.get('/healthcheck', ioc.systemController.healthcheck)

// 404
router.use(ioc.systemController.notFound)

export default router
