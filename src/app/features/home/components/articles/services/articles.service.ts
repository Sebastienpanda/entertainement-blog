import {inject, Injectable, signal} from '@angular/core';
import {map, Observable, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Article} from '@typesTs/article';
import {environment} from '@environments/environment';
import {User} from '@typesTs/user';
import {DataMergingService} from '@core/services/data-merging.service';

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    protected readonly _http = inject(HttpClient);
    protected readonly _dataMergingService = inject(DataMergingService);
    protected readonly articles = signal<Article[]>([]);
    protected readonly article = signal<Article | null>(null);

    getArticles(): Observable<Article[]> {
        return this._http.get<Article[]>(`${environment.apiURL}/articles`).pipe(
            switchMap(articles =>
                this._http.get<User[]>(`${environment.apiURL}/users`).pipe(
                    map(users => this._dataMergingService.mergeArticlesWithAuthors(articles, users))
                )
            ),
            tap(merged => this.articles.set(merged))
        );
    }

    getArticleById(id: string): Observable<Article> {
        return this._http.get<Article>(`${environment.apiURL}/articles/${id}`).pipe(
            switchMap(article =>
                this._http.get<User>(`${environment.apiURL}/users/${article.author_id}`).pipe(
                    map(user => this._dataMergingService.mergeSingleArticleWithAuthor(article, user))
                )
            )
        );
    }

    getArticlesByAuthorId(authorId: string): Observable<Article[]> {
        return this._http.get<Article[]>(`${environment.apiURL}/articles?author_id=${authorId}`).pipe(
            switchMap(articles =>
                this._http.get<User>(`${environment.apiURL}/users/${authorId}`).pipe(
                    map(user => articles.map(article => this._dataMergingService.mergeSingleArticleWithAuthor(article, user)))
                )
            )
        );
    }

    sortByAuthor(articles: Article[], direction: "ASC" | "DESC"): Article[] {
        return [...articles].sort((a, b) => {
            const nameA = a.author?.fullName ?? '';
            const nameB = b.author?.fullName ?? '';
            const comparison = nameA.localeCompare(nameB);
            return direction === "ASC" ? comparison : -comparison;
        });
    }

    sortByTitle(articles: Article[], direction: "ASC" | "DESC"): Article[] {
        return [...articles].sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return direction === "ASC" ? comparison : -comparison;
        });
    }
}
