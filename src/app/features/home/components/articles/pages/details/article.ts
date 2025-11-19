import {Component, inject, input} from '@angular/core';
import {Router} from '@angular/router';
import {Article} from '@typesTs/article';
import {DatePipe} from '@angular/common';
import {ReadingTimePipe} from '@shared/pipes/reading-time-pipe';
import {CommentsService} from '../../services/comments.service';
import {ArrowLeft, LucideAngularModule} from 'lucide-angular';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';

@Component({
    selector: "app-article",
    imports: [
        DatePipe,
        ReadingTimePipe,
        LucideAngularModule,
    ],
    templateUrl: "./article.html"
})

export default class ArticleDetail {
    readonly id = input.required<string>()
    readonly article = input<Article | null>(null)
    protected readonly _router = inject(Router)
    protected readonly _commentsService = inject(CommentsService)
    protected readonly ArrowLeft = ArrowLeft;
    protected readonly comments = toSignal(
        toObservable(this.id).pipe(
            switchMap(id => this._commentsService.getCommentsByArticleId(id))
        ),
        {initialValue: []}
    );

    navigateToHomepage(): void {
        this._router.navigate(["/"])
    }
}
