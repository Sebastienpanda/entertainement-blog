import {ResolveFn} from '@angular/router';
import {ArticlesService} from './services/articles.service';
import {inject} from '@angular/core';
import {Article} from '@typesTs/article';

export const articleResolver: ResolveFn<Article | null | undefined> = (route) => {
    const articleService = inject(ArticlesService)
    const id = route.paramMap.get('id')

    if (!id) {
        return null
    }

    return articleService.getArticleById(id)
}
