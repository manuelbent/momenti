/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderateText(text: string): Promise<boolean>
    classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }>
    generateImagePrompt(prompt: string): Promise<string>
    generateMoment(prompt: string, options: GenerateMomentOptions): AsyncGenerator<LLMStreamPayload>
    patchMoment(params: PatchMomentParams): AsyncGenerator<LLMStreamPayload>
}
