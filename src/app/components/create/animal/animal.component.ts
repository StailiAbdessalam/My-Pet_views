import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentPerson } from 'src/app/core/interfaces/Person';
import { Alert } from 'src/app/core/interfaces/alert';
import { Animal } from 'src/app/core/interfaces/animal';
import { AuthService } from 'src/app/core/services/auth.service';
import { CONSTANTS } from 'src/app/shared/components/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.scss'],
})
export class AnimalComponent implements OnInit {
  alertStyle: Alert = new Alert();
  messageAlert: string = '';
  loading: boolean = false;
  openModal: boolean = false;
  currentPerson: CurrentPerson | undefined | null = null;

  // list of animals
  myAnimals: Animal[] = [];

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.accessToken,
    }),
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.authService.accessToken) this.router.navigate(['/']);
    this.currentPerson = this.authService.getPersonFromLocalStorage();
    this.getMyAnimals();
    this.addAnimalForm.patchValue({
      referencePerson: this.currentPerson?.referencePerson,
    });
  }

  getMyAnimals() {
    this.http
      .get(
        CONSTANTS.urls.getMyAnimals + this.currentPerson?.referencePerson)
      .subscribe((response: any) => {
        console.log(response);
        this.myAnimals = response;
      });
  }

  toggleModal() {
    this.openModal = !this.openModal;
  }

  cancelAnimalForm() {
    this.toggleModal();
    this.addAnimalForm.reset();
  }

  submitAddAnimalForm(): void {
    console.log(this.addAnimalForm.value);
    this.loading = true;

    if (this.addAnimalForm.valid) {
      this.http
        .post(
          CONSTANTS.urls.addAnimal,
          this.addAnimalForm.value,
          this.httpOptions
        )
        .subscribe((response: any) => {
          console.log(response);
          this.loading = false;
          this.messageAlert = 'Animal added successfully';
          this.getMyAnimals();
          this.successAlert();
          this.cancelAnimalForm();
        }),
        (error: any) => {
          console.log(error);
          this.loading = false;
          this.messageAlert = 'Error adding animal';
          this.errorAlert();
          this.toggleModal();
        };
    } else {
      this.loading = false;
      this.messageAlert = 'Error adding animal';
      this.errorAlert();
      this.toggleModal();
    }
  }

  
  addAnimalForm: FormGroup = new FormGroup({
    referencePerson: new FormControl(''),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
    ]),
    type: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    picture: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
  });

  get name() {
    return this.addAnimalForm.get('name');
  }
  get age() {
    return this.addAnimalForm.get('age');
  }
  get type() {
    return this.addAnimalForm.get('type');
  }
  get picture() {
    return this.addAnimalForm.get('picture');
  }

  deleteAnimal(referenceAnimal: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.http
          .delete(CONSTANTS.urls.deleteAnimal + referenceAnimal)
          .subscribe((response: any) => {
            this.loading = false;
            console.log(response);
            this.messageAlert = 'Animal deleted successfully';
            this.getMyAnimals();
            this.successAlert();
          }),
          (error: any) => {
            this.loading = false;
            if(error.status === 200) {
                this.messageAlert = 'Animal deleted successfully';
                this.getMyAnimals();
                this.successAlert();
            } else {
                console.log(error);
                this.messageAlert = 'Error deleting animal';
                this.errorAlert();
            }
          };
      }
    })
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
