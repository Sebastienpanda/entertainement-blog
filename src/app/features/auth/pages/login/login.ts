import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthServices} from '@features/auth/services/auth.services';
import {Router} from '@angular/router';

interface LoginInter {
    email: FormControl<string>
    password: FormControl<string>
}

@Component({
    selector: "app-login",
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: "./login.html"
})

export class Login {
    protected readonly _authService = inject(AuthServices)
    protected readonly _router = inject(Router)
    protected readonly form = new FormGroup<LoginInter>({
        email: new FormControl("", {
            validators: Validators.required,
            nonNullable: true
        }),
        password: new FormControl("", {
            validators: Validators.required,
            nonNullable: true
        })
    })

    onSubmit(): void {
        if (this.form.valid) {
            const {email, password} = this.form.getRawValue()
            this._authService.login(email, password).subscribe({
                next: () => {
                    this._router.navigate(["me"])
                },
                error: (error) => {
                    console.error('Login failed:', error);
                }
            });
        }
    }
}
