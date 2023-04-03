import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentPerson } from 'src/app/core/interfaces/Person';
import { Post } from 'src/app/core/interfaces/post';
import { AdoptService } from 'src/app/core/services/adopt.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CONSTANTS } from 'src/app/shared/components/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  openedComment: boolean = false;
  handleOpenedComment(openedComment: boolean) {
    this.openedComment = openedComment;
  }

  allPosts: Post[] = [];
  currentPerson: CurrentPerson = new CurrentPerson();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private adopt: AdoptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllPosts();
    if (
      this.authService.getPersonFromLocalStorage() != null &&
      this.authService.getPersonFromLocalStorage() != undefined
    ) {
      this.currentPerson = this.authService.getPersonFromLocalStorage();
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
                this.getAllPosts();
              },
              (error) => {
                console.log(error);
                Swal.fire('Error!', "You can't adopt the pet.", 'error');
              }
            );
        }
      });
    }
  }

  getAllPosts() {
    this.http.get(CONSTANTS.urls.getAllPosts).subscribe((response: any) => {
      console.log(response);
      this.allPosts = response;
    });
  }
}
