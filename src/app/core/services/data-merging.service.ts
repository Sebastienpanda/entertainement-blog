import {Injectable} from '@angular/core';
import {Article} from '@typesTs/article';
import {User} from '@typesTs/user';
import {Comment} from '@typesTs/comment';

@Injectable({
    providedIn: 'root'
})
export class DataMergingService {
    mergeArticlesWithAuthors(articles: Article[], users: User[]): Article[] {
        return articles.map(article => {
            const author = users.find(u => u.id === article.author_id);
            return {
                ...article,
                author,
            };
        });
    }

    mergeCommentsWithUsers(comments: Comment[], users: User[]): Comment[] {
        return comments.map(comment => {
            const user = users.find(u => u.id === comment.user_id);
            return {
                ...comment,
                user,
            };
        });
    }

    mergeSingleArticleWithAuthor(article: Article, author: User): Article {
        return {
            ...article,
            author,
        };
    }
}
