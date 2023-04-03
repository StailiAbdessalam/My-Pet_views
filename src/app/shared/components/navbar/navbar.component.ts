import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { CurrentPerson } from 'src/app/core/interfaces/Person';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentPerson: CurrentPerson | null = null;

  constructor(private authService: AuthService) {
    this.currentPerson = authService.getPersonFromLocalStorage();
  }

  ngOnInit(): void {
  }

  logout() {
    this.currentPerson = null;
    this.authService.logoutPerson();
  }
}
