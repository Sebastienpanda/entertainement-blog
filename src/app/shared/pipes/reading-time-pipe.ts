import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'readingTime',
})
export class ReadingTimePipe implements PipeTransform {
    private readonly WORDS_PER_MINUTE = 200;

    transform(content: string): number {
        if (!content) {
            return 0;
        }

        const wordCount = content.trim().split(/\s+/).length;
        const minutes = wordCount / this.WORDS_PER_MINUTE;
        return Math.ceil(minutes);
    }
}
