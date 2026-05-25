/**
 * @interface LLMServiceInterface
 */
export default interface LLMServiceInterface {
    moderatePrompt(prompt: string): Promise<boolean>
    classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }>
    streamMoment(markdownCopy: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        rawMoment?: RawMoment;
        error?: string;
    }>
}
