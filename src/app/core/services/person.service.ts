import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentPerson } from '../interfaces/Person';
import { CONSTANTS } from 'src/app/shared/components/constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.accessToken
    })
  };

  getPersonProfile(rf: string): Observable<CurrentPerson> {
    return this.http.get<CurrentPerson>(CONSTANTS.urls.getByRf + '/' + rf, this.httpOptions);
  }

  updateUserProfile(user: CurrentPerson): Observable<boolean> {
    return this.http.post<boolean>(CONSTANTS.urls.edit, user, this.httpOptions);
  }
}
