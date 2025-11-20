import {Component, computed, effect, inject, input, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Article} from '@typesTs/article';
import {DatePipe} from '@angular/common';
import {ReadingTimePipe} from '@shared/pipes/reading-time-pipe';
import {CommentsService} from '../../services/comments.service';
import {AuthServices} from '@features/auth/services/auth.services';
import {ArrowLeft, LucideAngularModule} from 'lucide-angular';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ScrollService} from '../../../../../../core/services/scroll.service';
import {ScrollToTopButton} from '@shared/components/scroll-to-top-button/scroll-to-top-button';
import {CommentCard} from '@shared/components/comment-card/comment-card';
import {EmptyState} from '@shared/components/empty-state/empty-state';
import {Comment} from '@typesTs/comment';

@Component({
    selector: "app-article",
    imports: [
        DatePipe,
        ReadingTimePipe,
        LucideAngularModule,
        ReactiveFormsModule,
        RouterLink,
        FormsModule,
        ScrollToTopButton,
        CommentCard,
        EmptyState,
    ],
    templateUrl: "./article.html"
})

export default class ArticleDetail implements OnInit {
    readonly id = input.required<string>();
    readonly article = input<Article | null>(null);

    protected readonly _router = inject(Router);
    protected readonly _commentsService = inject(CommentsService);
    protected readonly _authService = inject(AuthServices);
    protected readonly _scrollService = inject(ScrollService);

    protected readonly ArrowLeft = ArrowLeft;
    protected readonly comments = signal<Comment[]>([]);
    protected readonly currentUser = signal(this._authService.getUser());
    protected readonly commentContent = new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true
    });

    protected readonly canComment = computed(() => {
        const user = this.currentUser();
        const article = this.article();

        if (!user || !article) return false;

        return article.author_id !== user.id;
    });

    protected readonly showCommentForm = computed(() => {
        return this.currentUser() !== null;
    });

    protected readonly sortedComments = computed(() => {
        const commentsList = this.comments();
        return [...commentsList].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    });

    constructor() {
        effect(() => {
            const articleId = this.id();
            if (articleId) {
                this._loadComments(articleId);
            }
        });
    }

    ngOnInit(): void {
        this._scrollService.initScrollTracking();
    }

    navigateToHomepage(): void {
        this._router.navigate(["/"]);
    }

    submitComment(): void {
        if (this.commentContent.invalid) return;

        const user = this.currentUser();
        const articleId = this.id();

        if (!user || !articleId) return;

        this._commentsService.createComment(articleId, user.id, this.commentContent.value).subscribe({
            next: () => {
                this.commentContent.reset();
                this._loadComments(articleId);
            },
            error: (error) => {
                console.error('Erreur lors de la création du commentaire:', error);
            }
        });
    }

    private _loadComments(articleId: string): void {
        this._commentsService.getCommentsByArticleId(articleId).subscribe(comments => {
            this.comments.set(comments);
        });
    }
}
