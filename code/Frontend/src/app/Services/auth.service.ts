import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  api_url = 'http://' + environment.backend_url + '/auth/'

  getUserFromLocalStorage() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  login(data: any) {
    return this.http.post(`${this.api_url}login/`, data);
  }

  register(data: any) {
    return this.http.post(`${this.api_url}register/`, data);
  }

  logout() {
    let user = this.getUserFromLocalStorage();

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.post(`${this.api_url}logout/`, null, { headers })
  }

  verifyAccount(data: any) {
    let user = this.getUserFromLocalStorage();

    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return this.http.post(`${this.api_url}verifyacc/`, data, { headers })
  }

  requestPasswordReset(email: string) {
    return this.http.post(`${this.api_url}password-reset/`, { email });
  }

  confirmPasswordReset(data: any) {
    return this.http.post(`${this.api_url}password-reset-confirm/`, data);
  }


}
