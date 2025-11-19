import {Component} from '@angular/core';
import {Articles} from './components/articles/articles';


@Component({
    selector: 'app-home',
    imports: [
        Articles
    ],
    templateUrl: './home.html',
})
export default class Home {

}
