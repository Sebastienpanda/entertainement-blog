import {Routes} from '@angular/router';
import {NotFound} from './features/not-found/not-found';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import("./features/home/home.routes"),
    },
    {
        path: '',
        loadChildren: () => import('./features/me/me.routes')
    },
    {
        path: '**',
        component: NotFound
    },
];
