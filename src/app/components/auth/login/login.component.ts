import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.accessToken) this.router.navigate(['/']);
  }

  submitLogin() {
    localStorage.clear();
    this.loading = true;

    this.authService
      .loginPerson(this.loginForm.value).subscribe(
        (response: any) => {
          // console.log(response.);
          this.loading = false;
          this.authService.accessToken = response.token;
          this.authService.addPersonToLocalStorage(response.personResponse);
          this.router.navigate(['/']);
          window.location.reload();
        },
        (error) => {
          console.log(error);
          this.loading = false;
          this.errorMessage = 'Login failed';
          setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        }
      );
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
  });

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
