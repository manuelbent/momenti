/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderateText(text: string): Promise<boolean>
    classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }>
    captureMoment(markdownCopy: string): AsyncGenerator<LLMStreamPayload>
    patchMoment(params: PatchMomentParams): AsyncGenerator<LLMStreamPayload>
}
