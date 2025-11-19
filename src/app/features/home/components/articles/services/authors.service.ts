import {inject, Injectable, signal} from '@angular/core';
import {User} from '@typesTs/user';
import {HttpClient} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {environment} from '@environments/environment';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class AuthorsService {
    protected readonly _http = inject(HttpClient)
    protected readonly _authors = signal<User[]>([])

    getAllAuthors(): Observable<User[]> {
        return this._http.get<User[]>(`${environment.apiURL}/users`).pipe(
            map(users => users.filter(user => user.isAuthor)),
            tap(authors => this._authors.set(authors))
        );
    }
}
