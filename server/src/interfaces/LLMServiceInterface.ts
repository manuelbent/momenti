/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderatePrompt(prompt: string): Promise<boolean>
    classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }>
    captureMoment(markdownCopy: string): AsyncGenerator<{
        phase?: 'art' | 'capture';
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }>
    patchMoment(params: PatchMomentParams): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }>
}
