import FeedbackController from '../controllers/FeedbackController'
import FormSubmissionController from '../controllers/FormSubmissionController'
import ImageController from '../controllers/ImageController'
import InviteKeyController from '../controllers/InviteKeyController'
import MomentController from '../controllers/MomentController'
import SystemController from '../controllers/SystemController'
import UserController from '../controllers/UserController'

import ChangeRepositoryInterface from '../interfaces/ChangeRepositoryInterface'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import FeedbackServiceInterface from '../interfaces/FeedbackServiceInterface'
import FeedbackRepositoryInterface from '../interfaces/FeedbackRepositoryInterface'
import FormSubmissionRepositoryInterface from '../interfaces/FormSubmissionRepositoryInterface'
import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'
import ImageRepositoryInterface from '../interfaces/ImageRepositoryInterface'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'
import InviteKeyServiceInterface from '../interfaces/InviteKeyServiceInterface'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'
import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import UserServiceInterface from '../interfaces/UserServiceInterface'

import ChangeLimitMiddleware from '../middlewares/ChangeLimitMiddleware'
import DownloadFormSubmissionsMiddleware from '../middlewares/DownloadFormSubmissionsMiddleware'
import GenerationGuardMiddleware from '../middlewares/GenerationGuardMiddleware'
import InviteKeyMiddleware from '../middlewares/InviteKeyMiddleware'
import MalformedDataMiddleware from '../middlewares/MalformedDataMiddleware'
import MomentContentModerationMiddleware from '../middlewares/MomentContentModerationMiddleware'
import MomentLimitMiddleware from '../middlewares/MomentLimitMiddleware'
import MomentOwnershipMiddleware from '../middlewares/MomentOwnershipMiddleware'
import PromptClassifierMiddleware from '../middlewares/PromptClassifierMiddleware'
import PromptModerationMiddleware from '../middlewares/PromptModerationMiddleware'
import PromptSanitizeMiddleware from '../middlewares/PromptSanitizeMiddleware'
import RateLimiterMiddleware from '../middlewares/RateLimiterMiddleware'
import SseMiddleware from '../middlewares/SseMiddleware'
import UploadMiddleware from '../middlewares/UploadMiddleware'
import ValidationErrorMiddleware from '../middlewares/ValidationErrorMiddleware'

import ChangeRepository from '../repositories/ChangeRepository'
import FeedbackRepository from '../repositories/FeedbackRepository'
import FormSubmissionRepository from '../repositories/FormSubmissionRepository'
import ImageRepository from '../repositories/ImageRepository'
import InviteKeyRepository from '../repositories/InviteKeyRepository'
import MomentRepository from '../repositories/MomentRepository'
import UserRepository from '../repositories/UserRepository'

import ChangeService from '../services/ChangeService'
import FeedbackService from '../services/FeedbackService'
import FormSubmissionService from '../services/FormSubmissionService'
import ImageService from '../services/ImageService'
import InviteKeyService from '../services/InviteKeyService'
import LLMService from '../services/LLMService'
import MomentService from '../services/MomentService'
import R2Service from '../services/R2Service'
import StreamCacheService from '../services/StreamCacheService'
import UserService from '../services/UserService'

import CheckSlugRequestValidator from '../validators/CheckSlugRequestValidator'
import GenerateMomentRequestValidator from '../validators/GenerateMomentRequestValidator'
import PatchMomentRequestValidator from '../validators/PatchMomentRequestValidator'
import SubmitFeedbackRequestValidator from '../validators/SubmitFeedbackRequestValidator'
import SubmitFormDataRequestValidator from '../validators/SubmitFormDataRequestValidator'
import UpdateMomentRequestValidator from '../validators/UpdateMomentRequestValidator'
import ValidateInviteKeyRequestValidator from '../validators/ValidateInviteKeyRequestValidator'

import StreamWorker from '../workers/StreamWorker'

/**
 * Dependency injection container.
 * @class Container
 */
class Container {
    // middlewares
    private _malformedDataMiddleware?: MalformedDataMiddleware
    private _validationErrorMiddleware?: ValidationErrorMiddleware
    private _sseMiddleware?: SseMiddleware
    private _inviteKeyMiddleware?: InviteKeyMiddleware
    private _momentLimitMiddleware?: MomentLimitMiddleware
    private _downloadFormSubmissionsMiddleware?: DownloadFormSubmissionsMiddleware
    private _uploadMiddleware?: UploadMiddleware
    private _promptSanitizeMiddleware?: PromptSanitizeMiddleware
    private _promptModerationMiddleware?: PromptModerationMiddleware
    private _promptClassifierMiddleware?: PromptClassifierMiddleware
    private _generationGuardMiddleware?: GenerationGuardMiddleware
    private _rateLimiterMiddleware?: RateLimiterMiddleware
    private _changeLimitMiddleware?: ChangeLimitMiddleware
    private _momentOwnershipMiddleware?: MomentOwnershipMiddleware
    private _momentContentModerationMiddleware?: MomentContentModerationMiddleware
    // repositories
    private _userRepository?: UserRepositoryInterface
    private _momentRepository?: MomentRepositoryInterface
    private _inviteKeyRepository?: InviteKeyRepositoryInterface
    private _formSubmissionRepository?: FormSubmissionRepositoryInterface
    private _feedbackRepository?: FeedbackRepositoryInterface
    private _changeRepository?: ChangeRepositoryInterface
    private _imageRepository?: ImageRepositoryInterface
    // services
    private _momentService?: MomentServiceInterface
    private _inviteKeyService?: InviteKeyServiceInterface
    private _userService?: UserServiceInterface
    private _formSubmissionService?: FormSubmissionServiceInterface
    private _feedbackService?: FeedbackServiceInterface
    private _streamCacheService?: StreamCacheServiceInterface
    private _changeService?: ChangeServiceInterface
    private _imageService?: ImageServiceInterface
    // services (non-orm)
    private _r2Service?: R2ServiceInterface
    private _llmService?: LLMServiceInterface
    // workers
    private _streamWorker?: StreamWorkerInterface
    // controllers
    private _systemController?: SystemController
    private _momentController?: MomentController
    private _inviteKeyController?: InviteKeyController
    private _userController?: UserController
    private _formSubmissionController?: FormSubmissionController
    private _feedbackController?: FeedbackController
    private _imageController?: ImageController
    // validators
    private _generateMomentRequestValidator?: GenerateMomentRequestValidator
    private _updateMomentRequestValidator?: UpdateMomentRequestValidator
    private _validateInviteKeyRequestValidator?: ValidateInviteKeyRequestValidator
    private _submitFormDataRequestValidator?: SubmitFormDataRequestValidator
    private _submitFeedbackRequestValidator?: SubmitFeedbackRequestValidator
    private _checkSlugRequestValidator?: CheckSlugRequestValidator
    private _patchMomentRequestValidator?: PatchMomentRequestValidator

    public get malformedDataMiddleware(): MalformedDataMiddleware {
        return this._malformedDataMiddleware ??= new MalformedDataMiddleware()
    }

    public get validationErrorMiddleware(): ValidationErrorMiddleware {
        return this._validationErrorMiddleware ??= new ValidationErrorMiddleware()
    }

    public get sseMiddleware(): SseMiddleware {
        return this._sseMiddleware ??= new SseMiddleware()
    }

    public get inviteKeyMiddleware(): InviteKeyMiddleware {
        return this._inviteKeyMiddleware ??= new InviteKeyMiddleware(this.inviteKeyRepository)
    }

    public get momentLimitMiddleware(): MomentLimitMiddleware {
        return this._momentLimitMiddleware ??= new MomentLimitMiddleware()
    }

    public get changeLimitMiddleware(): ChangeLimitMiddleware {
        return this._changeLimitMiddleware ??= new ChangeLimitMiddleware(this.momentService)
    }

    public get momentOwnerShipMiddleware(): MomentOwnershipMiddleware {
        return this._momentOwnershipMiddleware ??= new MomentOwnershipMiddleware(this.momentService)
    }

    public get downloadFormSubmissionsMiddleware(): DownloadFormSubmissionsMiddleware {
        return this._downloadFormSubmissionsMiddleware ??= new DownloadFormSubmissionsMiddleware()
    }

    public get uploadMiddleware(): UploadMiddleware {
        return this._uploadMiddleware ??= new UploadMiddleware()
    }

    public get promptSanitizeMiddleware(): PromptSanitizeMiddleware {
        return this._promptSanitizeMiddleware ??= new PromptSanitizeMiddleware()
    }

    public get promptModerationMiddleware(): PromptModerationMiddleware {
        return this._promptModerationMiddleware ??= new PromptModerationMiddleware(this.llmService)
    }

    public get momentContentModerationMiddleware(): MomentContentModerationMiddleware {
        return this._momentContentModerationMiddleware ??= new MomentContentModerationMiddleware(this.llmService)
    }

    public get promptClassifierMiddleware(): PromptClassifierMiddleware {
        return this._promptClassifierMiddleware ??= new PromptClassifierMiddleware(this.llmService)
    }

    public get generationGuardMiddleware(): GenerationGuardMiddleware {
        return this._generationGuardMiddleware ??= new GenerationGuardMiddleware(this.streamWorker)
    }

    public get rateLimiterMiddleware(): RateLimiterMiddleware {
        return this._rateLimiterMiddleware ??= new RateLimiterMiddleware()
    }

    public get userRepository(): UserRepositoryInterface {
        return this._userRepository ??= new UserRepository()
    }

    public get momentRepository(): MomentRepositoryInterface {
        return this._momentRepository ??= new MomentRepository()
    }

    public get changeRepository(): ChangeRepositoryInterface {
        return this._changeRepository ??= new ChangeRepository()
    }

    public get inviteKeyRepository(): InviteKeyRepositoryInterface {
        return this._inviteKeyRepository ??= new InviteKeyRepository()
    }

    public get formSubmissionRepository(): FormSubmissionRepositoryInterface {
        return this._formSubmissionRepository ??= new FormSubmissionRepository()
    }

    public get feedbackRepository(): FeedbackRepositoryInterface {
        return this._feedbackRepository ??= new FeedbackRepository()
    }

    public get imageRepository(): ImageRepositoryInterface {
        return this._imageRepository ??= new ImageRepository()
    }

    public get momentService(): MomentServiceInterface {
        return this._momentService ??= new MomentService(this.momentRepository)
    }

    public get changeService(): ChangeServiceInterface {
        return this._changeService ??= new ChangeService(this.changeRepository)
    }

    public get inviteKeyService(): InviteKeyServiceInterface {
        return this._inviteKeyService ??= new InviteKeyService(this.inviteKeyRepository)
    }

    public get userService(): UserServiceInterface {
        return this._userService ??= new UserService(this.userRepository)
    }

    public get formSubmissionService(): FormSubmissionServiceInterface {
        return this._formSubmissionService ??= new FormSubmissionService(this.formSubmissionRepository)
    }

    public get feedbackService(): FeedbackServiceInterface {
        return this._feedbackService ??= new FeedbackService(this.feedbackRepository)
    }

    public get imageService(): ImageServiceInterface {
        return this._imageService ??= new ImageService(this.imageRepository)
    }

    public get r2Service(): R2ServiceInterface {
        return this._r2Service ??= new R2Service()
    }

    public get llmService(): LLMServiceInterface {
        return this._llmService ??= new LLMService()
    }

    public get streamCacheService(): StreamCacheServiceInterface {
        return this._streamCacheService ??= new StreamCacheService()
    }

    public get streamWorker(): StreamWorkerInterface {
        return this._streamWorker ??= new StreamWorker(this.llmService, this.streamCacheService)
    }

    public get momentController(): MomentController {
        return this._momentController ??= new MomentController(this.momentService, this.changeService, this.streamWorker)
    }

    public get systemController(): SystemController {
        return this._systemController ??= new SystemController()
    }

    public get inviteKeyController(): InviteKeyController {
        return this._inviteKeyController ??= new InviteKeyController(this.inviteKeyService, this.userService)
    }

    public get userController(): UserController {
        return this._userController ??= new UserController(this.userService)
    }

    public get formSubmissionController(): FormSubmissionController {
        return this._formSubmissionController ??= new FormSubmissionController(this.formSubmissionService)
    }

    public get feedbackController(): FeedbackController {
        return this._feedbackController ??= new FeedbackController(this.feedbackService)
    }

    public get generateMomentRequestValidator(): GenerateMomentRequestValidator {
        return this._generateMomentRequestValidator ??= new GenerateMomentRequestValidator()
    }

    public get updateMomentRequestValidator(): UpdateMomentRequestValidator {
        return this._updateMomentRequestValidator ??= new UpdateMomentRequestValidator(this.momentService)
    }

    public get validateInviteKeyRequestValidator(): ValidateInviteKeyRequestValidator {
        return this._validateInviteKeyRequestValidator ??= new ValidateInviteKeyRequestValidator()
    }

    public get submitFormDataRequestValidator(): SubmitFormDataRequestValidator {
        return this._submitFormDataRequestValidator ??= new SubmitFormDataRequestValidator(this.momentService)
    }

    public get submitFeedbackRequestValidator(): SubmitFeedbackRequestValidator {
        return this._submitFeedbackRequestValidator ??= new SubmitFeedbackRequestValidator()
    }

    public get checkSlugRequestValidator(): CheckSlugRequestValidator {
        return this._checkSlugRequestValidator ??= new CheckSlugRequestValidator()
    }

    public get patchMomentRequestValidator(): PatchMomentRequestValidator {
        return this._patchMomentRequestValidator ??= new PatchMomentRequestValidator()
    }

    public get imageController(): ImageController {
        return this._imageController ??= new ImageController(this.imageService, this.r2Service)
    }
}

export default new Container()
