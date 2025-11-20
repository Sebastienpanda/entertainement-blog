import {Component, input} from '@angular/core';
import {User} from '@typesTs/user';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
    selector: 'app-user-avatar',
    templateUrl: './user-avatar.html'
})
export class UserAvatar {
    readonly user = input.required<User | undefined>();
    readonly size = input<AvatarSize>('md');
    readonly showName = input(false);
    readonly showRing = input(false);

    protected getSizeClass(): string {
        const sizeMap: Record<AvatarSize, string> = {
            'xs': 'w-8',
            'sm': 'w-10',
            'md': 'w-12',
            'lg': 'w-24',
            'xl': 'w-32'
        };
        return sizeMap[this.size()];
    }
}
