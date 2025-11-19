export function calculateReadingTime(content: string): number {
    const WORDS_PER_MINUTE = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = wordCount / WORDS_PER_MINUTE;
    return Math.ceil(minutes);
}
