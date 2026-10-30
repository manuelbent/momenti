/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderateText(text: string, context: LLMRequestContext): Promise<boolean>
    classifyPrompt(prompt: string, context: LLMRequestContext): Promise<{ valid: boolean; reason?: string }>
    generateImagePrompt(prompt: string, context: LLMRequestContext): Promise<string>
    generateImage(prompt: string, context: LLMRequestContext): Promise<Buffer>
    generateMoment(prompt: string, options: GenerateMomentOptions, context: LLMRequestContext): AsyncGenerator<LLMStreamPayload>
    patchMoment(params: PatchMomentParams, context: LLMRequestContext): AsyncGenerator<LLMStreamPayload>
}
