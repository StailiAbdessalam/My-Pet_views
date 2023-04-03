import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError, Observable, of, switchMap } from 'rxjs';
import { CONSTANTS } from '../../shared/components/constants';
import { CurrentPerson, Person } from '../interfaces/Person';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userLoggedIn = false;
  private token: string = "";
  public currentPerson: CurrentPerson = new CurrentPerson();

  constructor(private http: HttpClient, private route: Router) {  
    this.currentPerson = this.getPersonFromLocalStorage();
  }

  public getPersonFromLocalStorage(): CurrentPerson {
    const person = localStorage.getItem('currentPerson');
    return person != null ? JSON.parse(person) : null;
  }

  public addPersonToLocalStorage(person: CurrentPerson) {
    localStorage.setItem('currentPerson', JSON.stringify(person));
  }

  public loadToken(): string {
    const currentToken = localStorage.getItem("access_token");
    this.token = currentToken != null ? currentToken : "";
    return this.token;
  }

  set accessToken(token: string) {
    localStorage.setItem("access_token", token);
  }
  get accessToken(): string {
    return localStorage.getItem("access_token") ?? '';
  }

  isUserLoggedIn() {
    return this.userLoggedIn;
  }

  logUserIn() {
    this.userLoggedIn = true;
  }

  registerPerson(registerData: CurrentPerson) {
    console.log(registerData);
    return this.http.post(CONSTANTS.urls.register, registerData);
  }


  
  loginPerson(loginData: Person) {
    console.log(loginData);
    return this.http.post(CONSTANTS.urls.login, loginData);
  }


  logoutPerson(): void {
    this.userLoggedIn = false;
    localStorage.clear();
    this.route.navigate(["/login"])
  }

}
