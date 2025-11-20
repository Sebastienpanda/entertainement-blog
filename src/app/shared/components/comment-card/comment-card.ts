import {Component, input} from '@angular/core';
import {Comment} from '@typesTs/comment';
import {UserAvatar} from '../user-avatar/user-avatar';

@Component({
    selector: 'app-comment-card',
    imports: [UserAvatar],
    templateUrl: './comment-card.html'
})
export class CommentCard {
    readonly comment = input.required<Comment>();
    readonly showArticleTitle = input(false);
    readonly articleTitle = input<string>();
}
