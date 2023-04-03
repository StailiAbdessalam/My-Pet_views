import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentPerson } from 'src/app/core/interfaces/Person';
import { Alert } from 'src/app/core/interfaces/alert';
import { Animal } from 'src/app/core/interfaces/animal';
import { Post } from 'src/app/core/interfaces/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { CONSTANTS } from 'src/app/shared/components/constants';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit {
  animals: Animal[] = [];
  alertStyle: Alert = new Alert();
  messageAlert: string = '';
  loading: boolean = false;
  openModal: boolean = false;
  currentPerson: CurrentPerson | undefined | null = null;
  myAnimals: Animal[] = [];
  myPosts: Post[] = [];


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

  ngOnInit(): void {
    if (!this.authService.accessToken) this.router.navigate(['/']);
    this.currentPerson = this.authService.getPersonFromLocalStorage();
    this.getMyPosts();
    this.getMyAnimals();
    this.addPostForm.patchValue({
      referencePerson: this.currentPerson?.referencePerson,
    });
  }

  getMyPosts() {
    this.http
      .get(CONSTANTS.urls.getMyPosts + this.currentPerson?.referencePerson)
      .subscribe((response: any) => {
        console.log(response);
        this.myPosts = response;
      });
  }
  getMyAnimals() {
    this.http
      .get(
        CONSTANTS.urls.getMyAnimalsNewPost + this.currentPerson?.referencePerson)
      .subscribe((response: any) => {
        console.log(response);
        this.myAnimals = response;
      });
  }

  deletePost(referencePost: string) {
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
        this.http
          .delete(CONSTANTS.urls.deletePost + referencePost)
          .subscribe((response: any) => {
            console.log(response);
            this.getMyPosts();
          });
      }
    })
  }
  

  toggleModal() {
    this.openModal = !this.openModal;
  }

  cancelPostForm() {
    this.addPostForm.reset();
    this.toggleModal();
  }

  submitAddPostForm(): void {
    this.loading = true;
    console.log(this.addPostForm.value);
    this.http
      .post(CONSTANTS.urls.addPost, this.addPostForm.value)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.getMyPosts();
          this.loading = false;
          this.toggleModal();
          this.addPostForm.reset();
          this.messageAlert = 'Animal added successfully';
          this.successAlert();
        },
        (error) => {
          console.log(error);
          this.loading = false;
          this.messageAlert = 'Error adding animal';
          this.errorAlert();
        }
      );

  }

  addPostForm: FormGroup = new FormGroup({
    referenceAnimal: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]),
    days: new FormControl('', [Validators.required, Validators.min(1), Validators.max(30)]),
    referencePerson: new FormControl(this.currentPerson?.referencePerson, [Validators.required])
  });

  get title() {
    return this.addPostForm.get('title');
  }

  get description() {
    return this.addPostForm.get('description');
  }

  get days() {
    return this.addPostForm.get('days');
  }

  get referenceAnimal() {
    return this.addPostForm.get('referenceAnimal');
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
