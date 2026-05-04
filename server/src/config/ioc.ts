import MalformedDataMiddleware from '../middlewares/MalformedDataMiddleware'
import ValidationErrorMiddleware from '../middlewares/ValidationErrorMiddleware'
import SseMiddleware from '../middlewares/SseMiddleware'
import InviteKeyMiddleware from '../middlewares/InviteKeyMiddleware'
import MomentLimitMiddleware from '../middlewares/MomentLimitMiddleware'
import SystemController from '../controllers/SystemController'
import MomentController from '../controllers/MomentController'
import InviteKeyController from '../controllers/InviteKeyController'
import UserController from '../controllers/UserController'
import MomentService from '../services/MomentService'
import InviteKeyService from '../services/InviteKeyService'
import UserService from '../services/UserService'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import InviteKeyServiceInterface from '../interfaces/InviteKeyServiceInterface'
import UserServiceInterface from '../interfaces/UserServiceInterface'
import PromptValidator from '../validators/PromptValidator'
import GenerateMomentRequestValidator from '../validators/GenerateMomentRequestValidator'
import ValidateInviteKeyRequestValidator from '../validators/ValidateInviteKeyRequestValidator'
import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'
import UserRepository from '../repositories/UserRepository'
import MomentRepository from '../repositories/MomentRepository'
import InviteKeyRepository from '../repositories/InviteKeyRepository'
import UpdateMomentRequestValidator from '../validators/UpdateMomentRequestValidator'
import CheckSlugRequestValidator from '../validators/CheckSlugRequestValidator'

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
    // repositories
    private _userRepository?: UserRepositoryInterface
    private _momentRepository?: MomentRepositoryInterface
    private _inviteKeyRepository?: InviteKeyRepositoryInterface
    // services
    private _momentService?: MomentServiceInterface
    private _inviteKeyService?: InviteKeyServiceInterface
    private _userService?: UserServiceInterface
    // controllers
    private _systemController?: SystemController
    private _momentController?: MomentController
    private _inviteKeyController?: InviteKeyController
    private _userController?: UserController
    // validators
    private _promptValidator?: PromptValidator
    private _generateMomentRequestValidator?: GenerateMomentRequestValidator
    private _updateMomentRequestValidator?: UpdateMomentRequestValidator
    private _checkSlugRequestValidator?: CheckSlugRequestValidator
    private _validateInviteKeyRequestValidator?: ValidateInviteKeyRequestValidator

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
        return this._momentLimitMiddleware ??= new MomentLimitMiddleware(this.momentRepository)
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

    public get momentService(): MomentServiceInterface {
        return this._momentService ??= new MomentService(this.momentRepository)
    }

    public get inviteKeyService(): InviteKeyServiceInterface {
        return this._inviteKeyService ??= new InviteKeyService(this.inviteKeyRepository)
    }

    public get userService(): UserServiceInterface {
        return this._userService ??= new UserService(this.userRepository)
    }

    public get momentController(): MomentController {
        return this._momentController ??= new MomentController(this.momentService, this.userService)
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
}

export default new Container()
