/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderateText(text: string): Promise<boolean>
    classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }>
    generateImagePrompt(prompt: string): Promise<string>
    captureMoment(prompt: string, heroImageUrl: string): AsyncGenerator<LLMStreamPayload>
    patchMoment(params: PatchMomentParams): AsyncGenerator<LLMStreamPayload>
}
