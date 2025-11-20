import {Component, input} from '@angular/core';

@Component({
    selector: 'app-empty-state',
    templateUrl: './empty-state.html'
})
export class EmptyState {
    readonly icon = input('📭');
    readonly title = input.required<string>();
    readonly message = input.required<string>();
}
