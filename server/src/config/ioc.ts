import MalformedDataMiddleware from '../middlewares/MalformedDataMiddleware'
import ValidationErrorMiddleware from '../middlewares/ValidationErrorMiddleware'
import SseMiddleware from '../middlewares/SseMiddleware'
import SystemController from '../controllers/SystemController'
import MomentController from '../controllers/MomentController'
import MomentService from '../services/MomentService'
import PromptValidator from '../validators/PromptValidator'
import GenerateMomentRequestValidator from '../validators/GenerateMomentRequestValidator'
import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import UserRepository from '../repositories/UserRepository'
import MomentRepository from '../repositories/MomentRepository'

/**
 * Dependency injection container.
 * @class Container
 */
class Container {
    // middlewares
    private _malformedDataMiddleware?: MalformedDataMiddleware
    private _validationErrorMiddleware?: ValidationErrorMiddleware
    private _sseMiddleware?: SseMiddleware
    // repositories
    private _userRepository?: UserRepositoryInterface
    private _momentRepository?: MomentRepositoryInterface
    // services
    private _momentService?: MomentService
    // controllers
    private _systemController?: SystemController
    private _momentController?: MomentController
    // validators
    private _promptValidator?: PromptValidator
    private _generateMomentRequestValidator?: GenerateMomentRequestValidator

    public get malformedDataMiddleware(): MalformedDataMiddleware {
        return this._malformedDataMiddleware ??= new MalformedDataMiddleware()
    }

    public get validationErrorMiddleware(): ValidationErrorMiddleware {
        return this._validationErrorMiddleware ??= new ValidationErrorMiddleware()
    }

    public get sseMiddleware(): SseMiddleware {
        return this._sseMiddleware ??= new SseMiddleware()
    }

    public get userRepository(): UserRepositoryInterface {
        return this._userRepository ??= new UserRepository()
    }

    public get momentRepository(): MomentRepositoryInterface {
        return this._momentRepository ??= new MomentRepository()
    }

    public get momentService(): MomentService {
        return this._momentService ??= new MomentService(this.momentRepository)
    }

    public get momentController(): MomentController {
        return this._momentController ??= new MomentController(this.momentService)
    }

    public get systemController(): SystemController {
        return this._systemController ??= new SystemController()
    }

    public get promptValidator(): PromptValidator {
        return this._promptValidator ??= new PromptValidator()
    }

    public get generateMomentRequestValidator(): GenerateMomentRequestValidator {
        return this._generateMomentRequestValidator ??= new GenerateMomentRequestValidator()
    }
}

export default new Container()
