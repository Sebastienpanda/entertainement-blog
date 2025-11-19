import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from '@shared/components/ui/header/header';

@Component({
    selector: 'app-layout',
    imports: [
        RouterOutlet,
        Header
    ],
    templateUrl: './layout.html',
})
export class Layout {

}
