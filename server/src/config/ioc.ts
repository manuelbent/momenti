import MalformedDataMiddleware from '../middlewares/MalformedDataMiddleware'
import ValidationErrorMiddleware from '../middlewares/ValidationErrorMiddleware'
import SseMiddleware from '../middlewares/SseMiddleware'
import InviteKeyMiddleware from '../middlewares/InviteKeyMiddleware'
import MomentLimitMiddleware from '../middlewares/MomentLimitMiddleware'
import DownloadFormSubmissionsMiddleware from '../middlewares/DownloadFormSubmissionsMiddleware'
import SystemController from '../controllers/SystemController'
import MomentController from '../controllers/MomentController'
import InviteKeyController from '../controllers/InviteKeyController'
import UserController from '../controllers/UserController'
import FormSubmissionController from '../controllers/FormSubmissionController'
import MomentService from '../services/MomentService'
import InviteKeyService from '../services/InviteKeyService'
import UserService from '../services/UserService'
import FormSubmissionService from '../services/FormSubmissionService'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import InviteKeyServiceInterface from '../interfaces/InviteKeyServiceInterface'
import UserServiceInterface from '../interfaces/UserServiceInterface'
import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'
import PromptValidator from '../validators/PromptValidator'
import GenerateMomentRequestValidator from '../validators/GenerateMomentRequestValidator'
import ValidateInviteKeyRequestValidator from '../validators/ValidateInviteKeyRequestValidator'
import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'
import FormSubmissionRepositoryInterface from '../interfaces/FormSubmissionRepositoryInterface'
import UserRepository from '../repositories/UserRepository'
import MomentRepository from '../repositories/MomentRepository'
import InviteKeyRepository from '../repositories/InviteKeyRepository'
import FormSubmissionRepository from '../repositories/FormSubmissionRepository'
import UpdateMomentRequestValidator from '../validators/UpdateMomentRequestValidator'
import CheckSlugRequestValidator from '../validators/CheckSlugRequestValidator'
import SubmitFormDataRequestValidator from '../validators/SubmitFormDataRequestValidator'

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
    // repositories
    private _userRepository?: UserRepositoryInterface
    private _momentRepository?: MomentRepositoryInterface
    private _inviteKeyRepository?: InviteKeyRepositoryInterface
    private _formSubmissionRepository?: FormSubmissionRepositoryInterface
    // services
    private _momentService?: MomentServiceInterface
    private _inviteKeyService?: InviteKeyServiceInterface
    private _userService?: UserServiceInterface
    private _formSubmissionService?: FormSubmissionServiceInterface
    // controllers
    private _systemController?: SystemController
    private _momentController?: MomentController
    private _inviteKeyController?: InviteKeyController
    private _userController?: UserController
    private _formSubmissionController?: FormSubmissionController
    // validators
    private _promptValidator?: PromptValidator
    private _generateMomentRequestValidator?: GenerateMomentRequestValidator
    private _updateMomentRequestValidator?: UpdateMomentRequestValidator
    private _checkSlugRequestValidator?: CheckSlugRequestValidator
    private _validateInviteKeyRequestValidator?: ValidateInviteKeyRequestValidator
    private _submitFormDataRequestValidator?: SubmitFormDataRequestValidator

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

    public get downloadFormSubmissionsMiddleware(): DownloadFormSubmissionsMiddleware {
        return this._downloadFormSubmissionsMiddleware ??= new DownloadFormSubmissionsMiddleware()
    }

    public get userRepository(): UserRepositoryInterface {
        return this._userRepository ??= new UserRepository()
    }

    public get momentRepository(): MomentRepositoryInterface {
        return this._momentRepository ??= new MomentRepository()
    }

    public get inviteKeyRepository(): InviteKeyRepositoryInterface {
        return this._inviteKeyRepository ??= new InviteKeyRepository()
    }

    public get formSubmissionRepository(): FormSubmissionRepositoryInterface {
        return this._formSubmissionRepository ??= new FormSubmissionRepository()
    }

    public get momentService(): MomentServiceInterface {
        return this._momentService ??= new MomentService(this.momentRepository)
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

    public get momentController(): MomentController {
        return this._momentController ??= new MomentController(this.momentService)
    }

    public get systemController(): SystemController {
        return this._systemController ??= new SystemController()
    }

    public get inviteKeyController(): InviteKeyController {
        return this._inviteKeyController ??= new InviteKeyController(this.inviteKeyService)
    }

    public get userController(): UserController {
        return this._userController ??= new UserController(this.userService)
    }

    public get formSubmissionController(): FormSubmissionController {
        return this._formSubmissionController ??= new FormSubmissionController(this.formSubmissionService, this.momentRepository)
    }

    public get promptValidator(): PromptValidator {
        return this._promptValidator ??= new PromptValidator()
    }

    public get generateMomentRequestValidator(): GenerateMomentRequestValidator {
        return this._generateMomentRequestValidator ??= new GenerateMomentRequestValidator()
    }

    public get updateMomentRequestValidator(): UpdateMomentRequestValidator {
        return this._updateMomentRequestValidator ??= new UpdateMomentRequestValidator(this.momentService)
    }

    public get checkSlugRequestValidator(): CheckSlugRequestValidator {
        return this._checkSlugRequestValidator ??= new CheckSlugRequestValidator()
    }

    public get validateInviteKeyRequestValidator(): ValidateInviteKeyRequestValidator {
        return this._validateInviteKeyRequestValidator ??= new ValidateInviteKeyRequestValidator()
    }

    public get submitFormDataRequestValidator(): SubmitFormDataRequestValidator {
        return this._submitFormDataRequestValidator ??= new SubmitFormDataRequestValidator(this.momentService)
    }
}

export default new Container()
