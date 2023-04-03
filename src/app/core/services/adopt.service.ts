import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CONSTANTS } from 'src/app/shared/components/constants';

@Injectable({
  providedIn: 'root'
})
export class AdoptService {

  constructor(private http: HttpClient, private authService: AuthService) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.accessToken
    })
  };

  getAdoptList(referencePerson: string | null | undefined) {
    return this.http.get(CONSTANTS.urls.adoptList + referencePerson, this.httpOptions);
  }

  adoptPet(referencePerson: string, referencePost: string) {
    return this.http.post(CONSTANTS.urls.adopt, { referencePerson, referencePost }, this.httpOptions);
  }
}
