import {Component, effect, inject, signal} from '@angular/core';
import {AuthServices} from '@features/auth/services/auth.services';
import {Router, RouterLink} from '@angular/router';
import {ArticlesService} from '@features/home/components/articles/services/articles.service';
import {CommentsService} from '@features/home/components/articles/services/comments.service';
import {Article} from '@typesTs/article';
import {Comment} from '@typesTs/comment';
import {CommentCard} from '@shared/components/comment-card/comment-card';
import {EmptyState} from '@shared/components/empty-state/empty-state';

@Component({
    selector: "app-me-home",
    imports: [RouterLink, CommentCard, EmptyState],
    templateUrl: "./me-home.html"
})

export default class MeHome {
    protected readonly _authService = inject(AuthServices)
    protected readonly _articlesService = inject(ArticlesService)
    protected readonly _commentsService = inject(CommentsService)
    protected readonly _router = inject(Router)

    protected readonly user = signal(this._authService.getUser())
    protected readonly authorArticles = signal<Article[]>([])
    protected readonly authorComments = signal<Comment[]>([])

    constructor() {
        effect(() => {
            const currentUser = this.user()
            if (currentUser?.isAuthor) {
                this._articlesService.getArticlesByAuthorId(currentUser.id).subscribe(articles => {
                    this.authorArticles.set(articles)
                })
            } else {
                this.authorArticles.set([])
            }
        })

        effect(() => {
            const articles = this.authorArticles()
            if (articles.length > 0) {
                const articleIds = articles.map(article => article.id)
                this._commentsService.getCommentsByAuthorArticles(articleIds).subscribe(comments => {
                    this.authorComments.set(comments)
                })
            } else {
                this.authorComments.set([])
            }
        })
    }

    getArticleTitle(articleId: string): string {
        const article = this.authorArticles().find(a => a.id === articleId)
        return article?.title || 'Article inconnu'
    }

    onLogout() {
        this._authService.logout()
        this._router.navigate(["/"])
    }
}
