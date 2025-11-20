import {inject, Injectable} from '@angular/core';
import {map, Observable, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Comment} from '@typesTs/comment';
import {environment} from '@environments/environment';
import {User} from '@typesTs/user';
import {DataMergingService} from '@core/services/data-merging.service';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    protected readonly _http = inject(HttpClient);
    protected readonly _dataMergingService = inject(DataMergingService);

    getCommentsByArticleId(articleId: string): Observable<Comment[]> {
        return this._http.get<Comment[]>(`${environment.apiURL}/comments?article_id=${articleId}`).pipe(
            switchMap(comments =>
                this._http.get<User[]>(`${environment.apiURL}/users`).pipe(
                    map(users => this._dataMergingService.mergeCommentsWithUsers(comments, users))
                )
            )
        );
    }

    getCommentsByAuthorArticles(articleIds: string[]): Observable<Comment[]> {
        if (articleIds.length === 0) {
            return new Observable(observer => {
                observer.next([]);
                observer.complete();
            });
        }

        return this._http.get<Comment[]>(`${environment.apiURL}/comments`).pipe(
            switchMap(comments =>
                this._http.get<User[]>(`${environment.apiURL}/users`).pipe(
                    map(users => {
                        const filteredComments = comments.filter(comment =>
                            articleIds.includes(comment.article_id)
                        );
                        return this._dataMergingService.mergeCommentsWithUsers(filteredComments, users);
                    })
                )
            )
        );
    }

    createComment(articleId: string, userId: string, content: string): Observable<Comment> {
        const newComment = {
            content,
            user_id: userId,
            article_id: articleId,
            createdAt: new Date()
        };

        return this._http.post<Comment>(`${environment.apiURL}/comments`, newComment);
    }
}
