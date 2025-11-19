import {Injectable} from '@angular/core';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class UserInMemoryService {
    getUser(): boolean {
        return !!localStorage.getItem("user");
    }
}
