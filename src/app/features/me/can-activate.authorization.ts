import {CanMatchFn, MaybeAsync, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserInMemoryService} from './services/user-in-memory.service';

export const isLoggedInGuard: CanMatchFn = (): MaybeAsync<boolean> => {
    const userService = inject(UserInMemoryService)
    const router = inject(Router)
    const user = userService.getUser()

    if (!user) {
        router.navigate(["/connexion"])
    }

    return userService.getUser()
}
