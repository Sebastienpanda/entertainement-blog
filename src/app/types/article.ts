import {User} from '@typesTs/user';

export interface Article {
    id: string;
    title: string;
    content: string;
    thumbnail: string;
    author_id: string;
    author?: User;
    createdAt: Date;
}

