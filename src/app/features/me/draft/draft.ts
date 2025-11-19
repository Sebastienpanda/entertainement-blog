import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';

interface Email {
    email: FormControl<string>
}


@Component({
    selector: "app-me-draft",
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    templateUrl: "./draft.html"
})
export default class MeDraft {
    readonly form = new FormGroup<Email>(
        {
            email: new FormControl("", {
                validators: Validators.required,
                nonNullable: true
            })
        }
    )

    onSubmit(): void {
        console.log("ok")
    }
}
