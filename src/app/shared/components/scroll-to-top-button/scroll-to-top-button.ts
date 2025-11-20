import {Component, inject} from '@angular/core';
import {ScrollService} from '../../../core/services/scroll.service';
import {ArrowUp, LucideAngularModule} from 'lucide-angular';

@Component({
    selector: 'app-scroll-to-top-button',
    imports: [LucideAngularModule],
    templateUrl: './scroll-to-top-button.html'
})
export class ScrollToTopButton {
    protected readonly _scrollService = inject(ScrollService);
    protected readonly ArrowUp = ArrowUp;
    protected readonly showButton = this._scrollService.showScrollToTop;

    scrollToTop(): void {
        this._scrollService.scrollToTop();
    }
}
