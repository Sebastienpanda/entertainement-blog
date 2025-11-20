import {Injectable, signal} from '@angular/core';
import {fromEvent, map, throttleTime} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScrollService {
    private readonly _showScrollToTop = signal(false);
    readonly showScrollToTop = this._showScrollToTop.asReadonly();

    private readonly _scrollThreshold = 300;

    initScrollTracking(): void {
        fromEvent(globalThis, 'scroll')
            .pipe(
                throttleTime(100),
                map(() => window.scrollY > this._scrollThreshold)
            )
            .subscribe(shouldShow => {
                this._showScrollToTop.set(shouldShow);
            });
    }

    scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
        window.scrollTo({
            top: 0,
            behavior
        });
    }
}
