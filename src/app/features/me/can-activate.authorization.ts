import {CanMatchFn, MaybeAsync} from '@angular/router';
import {inject} from '@angular/core';
import {UserInMemoryService} from './services/user-in-memory.service';

export const isLoggedInGuard: CanMatchFn = (): MaybeAsync<boolean> => {
    const userService = inject(UserInMemoryService)

    console.log(userService.getUser())

    return userService.getUser()
}
