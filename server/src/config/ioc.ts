import MalformedDataMiddleware from '../middlewares/MalformedDataMiddleware'
import ValidationErrorMiddleware from '../middlewares/ValidationErrorMiddleware'
import SseMiddleware from '../middlewares/SseMiddleware'
import SystemController from '../controllers/SystemController'
import MomentController from '../controllers/MomentController'
import MomentService from '../services/MomentService'
import PromptValidator from '../validators/PromptValidator'
import GenerateMomentRequestValidator from '../validators/GenerateMomentRequestValidator'

/**
 * Dependency injection container.
 * @class Container
 */
class Container {
    // middlewares
    private _malformedDataMiddleware?: MalformedDataMiddleware
    private _validationErrorMiddleware?: ValidationErrorMiddleware
    private _sseMiddleware?: SseMiddleware
    // controllers
    private _systemController?: SystemController
    private _momentController?: MomentController
    // services
    private _momentService?: MomentService
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

    public get momentService(): MomentService {
        return this._momentService ??= new MomentService()
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
