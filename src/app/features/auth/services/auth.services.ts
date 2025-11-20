import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {User} from '@typesTs/user';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {StorageService} from '@core/services/storage.service';

const USER_STORAGE_KEY = 'user';

@Injectable({
    providedIn: "root"
})
export class AuthServices {
    protected readonly _http = inject(HttpClient);
    protected readonly _storageService = inject(StorageService);

    login(email: string, password: string): Observable<boolean> {
        return this._http.get<User[]>(`${environment.apiURL}/users?email=${email}&password=${password}`).pipe(
            map((users) => {
                if (users && users.length > 0) {
                    const user = users[0];
                    this._storageService.setItem(USER_STORAGE_KEY, user);
                    return true;
                }
                return false;
            })
        );
    }

    getUser(): User | null {
        return this._storageService.getItem<User>(USER_STORAGE_KEY);
    }

    logout(): void {
        this._storageService.removeItem(USER_STORAGE_KEY);
    }
}
