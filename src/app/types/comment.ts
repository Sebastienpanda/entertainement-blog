import {User} from '@typesTs/user';

export interface Comment {
    id: string;
    content: string;
    user_id: string;
    article_id: string;
    createdAt: Date;
    user?: User;
}
