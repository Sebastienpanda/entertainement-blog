import {Routes} from '@angular/router';
import {Layout} from './layouts/layout';
import {articleResolver} from './components/articles/articles.resolver';

const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: "",
                loadComponent: () => import("./home")
            },
            {
                path: 'about',
                loadComponent: () => import('../about/about')
            },
            {
                path: 'articles/:id',
                resolve: {
                    article: articleResolver,
                },
                loadComponent: () => import('@features/home/components/articles/pages/details/article')
            }
        ]
    },
];

export default routes;
