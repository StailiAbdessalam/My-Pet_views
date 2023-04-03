import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CurrentPerson } from 'src/app/core/interfaces/Person';
import { PersonService } from 'src/app/core/services/person.service';
import { Alert } from 'src/app/core/interfaces/alert';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  person: CurrentPerson | null | undefined = undefined;
  alertStyle: Alert = new Alert();
  messageAlert: string = '';
  loading: boolean = false;

  constructor(
    private personService: PersonService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!this.authService.accessToken)
      this.router.navigate(['profile/history']);
    this.getPersonInfo();
  }

  getPersonInfo(): void {
    this.personService
      .getPersonProfile(
        this.authService.getPersonFromLocalStorage().referencePerson
      )
      .subscribe((person: CurrentPerson) => {
        console.log(person);
        this.person = person;
        this.editForm.patchValue({
          referencePerson: this.person.referencePerson,
          firstName: this.person.firstName,
          lastName: this.person.lastName,
          email: this.person.email,
          phone: this.person.phone,
          address: this.person.address,
          city: this.person.city,
        });
      });
  }

  submitEdit(): void {
    console.log(this.editForm.value);
    this.loading = true;

    if (this.editForm.valid) {
      this.personService
        .updateUserProfile(this.editForm.value)
        .subscribe((response: boolean) => {
          this.messageAlert = 'updated successfully';
          this.successAlert();
          const newPerson = this.person;
          newPerson!.firstName = this.editForm.value.firstName;
          newPerson!.lastName = this.editForm.value.lastName;
          newPerson!.address = this.editForm.value.address;
          newPerson!.city = this.editForm.value.city;
          newPerson!.phone = this.editForm.value.phone;
          newPerson!.referencePerson = this.person!.referencePerson;
          newPerson!.email = this.person!.email;
          this.authService.addPersonToLocalStorage(newPerson!);
          this.getPersonInfo();
        }),
        (error: any) => {
          this.messageAlert = 'update failed';
          this.errorAlert();
        };
      this.loading = false;
      return;
    }
    this.loading = false;
    this.messageAlert = 'All information required';
    this.errorAlert();
  }

  editForm: FormGroup = new FormGroup({
    referencePerson: new FormControl(this.person?.referencePerson || '', [
      Validators.required,
    ]),
    firstName: new FormControl(this.person?.firstName || '', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    lastName: new FormControl(this.person?.lastName || '', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: new FormControl(this.person?.email || '', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
    phone: new FormControl(this.person?.address || '', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
    ]),
    address: new FormControl(this.person?.address || '', [Validators.required]),
    city: new FormControl(this.person?.city || '', [Validators.required]),
  });

  get firstName() {
    return this.editForm.get('firstName');
  }
  get lastName() {
    return this.editForm.get('lastName');
  }
  get email() {
    return this.editForm.get('email');
  }
  get password() {
    return this.editForm.get('password');
  }
  get phone() {
    return this.editForm.get('phone');
  }
  get address() {
    return this.editForm.get('address');
  }
  get city() {
    return this.editForm.get('city');
  }

  successAlert(): void {
    this.alertStyle.svgstyle = `flex-shrink-0 w-5 h-5 text-green-700`;
    this.alertStyle.message = `ml-3 text-sm font-medium text-green-700`;
    this.alertStyle.button = `ml-auto -mx-1.5 -my-1.5 bg-green-100 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-green-200`;
    this.alertStyle.bg = `w-64 text-xs flex p-4 mb-4 bg-green-100 rounded-lg`;
    setTimeout(() => {
      this.messageAlert = '';
    }, 2000);
  }

  errorAlert(): void {
    this.alertStyle.svgstyle = `flex-shrink-0 w-5 h-5 text-red-700`;
    this.alertStyle.message = `ml-3 text-sm font-medium text-red-700`;
    this.alertStyle.button = `ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200`;
    this.alertStyle.bg = `w-64 text-xs flex p-4 mb-4 bg-red-100 rounded-lg`;
    setTimeout(() => {
      this.messageAlert = '';
    }, 2000);
  }
}
