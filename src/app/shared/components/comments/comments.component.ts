import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentPerson } from 'src/app/core/interfaces/Person';
import { Alert } from 'src/app/core/interfaces/alert';
import { Post } from 'src/app/core/interfaces/post';
import { AuthService } from 'src/app/core/services/auth.service';
import { CONSTANTS } from '../constants';
import { Comment } from 'src/app/core/interfaces/comment';
import Swal from 'sweetalert2';
import { AdoptService } from 'src/app/core/services/adopt.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  alertStyle: Alert = new Alert();
  messageAlert: string = '';
  loading: boolean = false;
  openComment: boolean = false;
  @Input() currentPerson: CurrentPerson = new CurrentPerson();
  @Input() post: Post = new Post();

  postsComments: Comment[] = [];

  @Output() openedComment = new EventEmitter<boolean>(this.openComment);
  sendOpenComment() {
    this.openedComment.emit(this.openComment);
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private adopt: AdoptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    this.http
      .get(CONSTANTS.urls.getComments + this.post.referencePost)
      .subscribe(
        (Response: any) => {
          console.log(Response);
          this.postsComments = Response;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  toggleComment() {
    this.openComment = !this.openComment;
    this.sendOpenComment();
    if (this.openComment) {
      this.addComment.patchValue({
        referencePost: this.post.referencePost,
        referencePerson: this.currentPerson.referencePerson,
      });
    }
  }

  newAdoption(post: Post) {
    if (
      this.authService.currentPerson == null ||
      this.authService.currentPerson == undefined ||
      this.authService.accessToken == null ||
      this.authService.accessToken == undefined ||
      this.authService.accessToken == ''
    ) {
      this.router.navigate(['/login']);
    } else {
      Swal.fire({
        title: 'Sweet!',
        text: 'Do you agree to adopt the pet for ' + post.days + ' days?',
        imageUrl: post.animal.picture,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'pet image',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, adopt it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.adopt
            .adoptPet(
              this.authService.currentPerson.referencePerson,
              post.referencePost
            )
            .subscribe(
              (response: any) => {
                Swal.fire(
                  'Adopted!',
                  'You have adopted the pet successfully.',
                  'success'
                );
                console.log(response);
                this.toggleComment();
              },
              (error) => {
                console.log(error);
                Swal.fire('Error!', "You can't adopt the pet.", 'error');
              }
            );
        }
      });    }
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.authService.accessToken,
    }),
  };

  submitAddComment() {
    console.log(this.addComment.value);
    this.loading = true;
    this.http.post(CONSTANTS.urls.addComment, this.addComment.value).subscribe(
      (Response: any) => {
        console.log(Response);
        this.loading = false;
        this.addComment.reset();
        this.successAlert();
        this.messageAlert = 'Comment added successfully';
        this.getComments();
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.errorAlert();
        this.messageAlert = 'Error adding comment';
      }
    );
  }

  deleteComment(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.http.delete(CONSTANTS.urls.deleteComment + id).subscribe(
          (response: any) => {
            console.log(response);
            if (response == true) {
              this.successAlert();
              this.messageAlert = 'Comment deleted successfully';
              this.getComments();
            } else {
              this.errorAlert();
              this.messageAlert = 'Error deleting comment';
            }
          },
          (error) => {
            console.log(error);
            this.errorAlert();
            this.messageAlert = 'Error deleting comment';
          }
        );
      }
    });
  }

  addComment: FormGroup = new FormGroup({
    referencePerson: new FormControl(this.currentPerson.referencePerson),
    referencePost: new FormControl(this.post.referencePost),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  get content() {
    return this.addComment.get('content');
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
