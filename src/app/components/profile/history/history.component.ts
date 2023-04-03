import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentPerson } from 'src/app/core/interfaces/Person';
import { Adoption } from 'src/app/core/interfaces/adoption';
import { AdoptService } from 'src/app/core/services/adopt.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  person: CurrentPerson = new CurrentPerson();
  adoptions: Adoption[] = [];

  openedComment: boolean = false;
  handleOpenedComment(openedComment: boolean) {
    this.openedComment = openedComment;
  }


  constructor(
    private authService: AuthService,
    private adopt: AdoptService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.accessToken)
      this.router.navigate(['profile/history']);
      this.person = this.authService.getPersonFromLocalStorage();
      this.getPersonAdoptions();
  }

  getPersonAdoptions() {
    this.adopt.getAdoptList(this.person?.referencePerson).subscribe(
      (response: any) => {
        this.adoptions = response;
        console.log(response);
    });
  }
}
