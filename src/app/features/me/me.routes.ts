import {Routes} from '@angular/router';
import {Me} from './me';
import {isLoggedInGuard} from './can-activate.authorization';
import {confirmExitGuard} from './can-deactivate.authorization';

const routes: Routes = [
    {
        path: "me",
        component: Me,
        canMatch: [isLoggedInGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./me-home/me-home")
            },
            {
                path: "draft",
                loadComponent: () => import("./draft/draft"),
                canDeactivate: [confirmExitGuard]
            }
        ]
    }
]

export default routes
