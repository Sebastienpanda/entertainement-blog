import {Component, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

interface Navigation {
    link: string;
    label: string;
}

@Component({
    selector: "app-header",
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: "./header.html"
})

export class Header {
    protected readonly _navigation = signal<Navigation[]>([
        {
            link: "/",
            label: "Home"
        }, {
            link: "/about",
            label: "About"
        }
    ])
}
