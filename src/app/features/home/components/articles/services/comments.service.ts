import {inject, Injectable} from '@angular/core';
import {map, Observable, switchMap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Comment} from '@typesTs/comment';
import {environment} from '@environments/environment';
import {User} from '@typesTs/user';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    protected readonly http = inject(HttpClient)

    getCommentsByArticleId(articleId: string): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${environment.apiURL}/comments?article_id=${articleId}`).pipe(
            switchMap(comments =>
                this.http.get<User[]>(`${environment.apiURL}/users`).pipe(
                    map(users => this.mergeCommentsWithUsers(comments, users))
                )
            )
        );
    }

    private mergeCommentsWithUsers(comments: Comment[], users: User[]): Comment[] {
        return comments.map(comment => {
            const user = users.find(u => u.id === comment.user_id);

            return {
                ...comment,
                user,
            };
        });
    }
}
