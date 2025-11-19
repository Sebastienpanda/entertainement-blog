import {inject, Injectable, signal} from '@angular/core';
import {map, Observable, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Article} from '@typesTs/article';
import {environment} from '@environments/environment';
import {User} from '@typesTs/user';

@Injectable({
    providedIn: 'root'
})
export class ArticlesService {
    protected readonly http = inject(HttpClient)
    protected readonly articles = signal<Article[]>([])
    protected readonly article = signal<Article | null>(null)

    getArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${environment.apiURL}/articles`).pipe(
            switchMap(articles =>
                this.http.get<User[]>(`${environment.apiURL}/users`).pipe(
                    map(users => this.mergeArticlesWithAuthors(articles, users))
                )
            ),
            tap(merged => this.articles.set(merged))
        );
    }

    getArticleById(id: string): Observable<Article> {
        return this.http.get<Article>(`${environment.apiURL}/articles/${id}`).pipe(
            switchMap(article =>
                this.http.get<User>(`${environment.apiURL}/users/${article.author_id}`).pipe(
                    map(user => ({
                        ...article,
                        author: user,
                    }))
                )
            ),
        )
    }

    getSortedByAuthors(sort: "ASC" | "DESC") {
        const list = this.articles()

        return [...list].sort((a, b) => {
            const nameA = a.author?.fullName
            const nameB = b.author?.fullName
            const comparison = nameA!.localeCompare(nameB!);
            return sort === "ASC" ? comparison : -comparison;
        })
    }

    getSortedByTitle(sort: "ASC" | "DESC"): Article[] {
        const list = this.articles()

        return [...list].sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return sort === "ASC" ? comparison : -comparison;
        })
    }

    private mergeArticlesWithAuthors(articles: Article[], users: User[]): Article[] {
        return articles.map(article => {
            const author = users.find(u => u.id === article.author_id);

            return {
                ...article,
                author,
            };
        });
    }
}
