/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderatePrompt(prompt: string): Promise<boolean>
    classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }>
    captureMoment(markdownCopy: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }>
    patchMoment(prompt: string, content: MomentContent, nodeId?: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }>
}
