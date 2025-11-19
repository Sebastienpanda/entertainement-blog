import {Component, inject, input} from '@angular/core';
import {Article as ArticleInter} from "@typesTs/article"
import {DatePipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {ArrowRight, LucideAngularModule} from 'lucide-angular';
import {ReadingTimePipe} from '@shared/pipes/reading-time-pipe';

@Component({
    selector: "app-article",
    imports: [
        DatePipe,
        RouterLink,
        LucideAngularModule,
        ReadingTimePipe
    ],
    templateUrl: "./article.html"
})

export class Article {
    readonly _article = input.required<ArticleInter>()
    protected readonly _router = inject(Router)
    protected readonly ArrowRight = ArrowRight;

    goToSectionComments(id: string): void {
        this._router.navigate(['articles', id], {
            fragment: 'comments',
        });
    }
}
