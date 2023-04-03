import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  errorMessage: string = '';
  loading: boolean = false;


  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    if(this.authService.accessToken) this.router.navigate(["/"])
  }

  submitRegister() {
    this.loading = true;

    this.authService.registerPerson(this.registerForm.value).subscribe(
      (response: any) => {
        this.loading = false;
        this.router.navigate(["/login"]);
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.errorMessage = 'Register failed';
        setTimeout(() => {
          this.errorMessage = '';
        } , 2000);
      }
     )
  }
  

  registerForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20),]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20),]),
      email: new FormControl("", [Validators.required, Validators.email,]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(20),]),
      phone: new FormControl("", [Validators.required, Validators.pattern(/^[0-9]+$/),]),
      address: new FormControl("", [Validators.required,]),
      city: new FormControl("", [Validators.required,])
    }
  )

  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get address() {
    return this.registerForm.get('address');
  }
  get city() {
    return this.registerForm.get('city');
  }



}
