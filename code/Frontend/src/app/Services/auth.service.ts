import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  api_url = 'http://localhost:8000/auth/'

  private user : any | undefined;

  getUserFromLocalStorage() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  login(data:any){
    return this.http.post(`${this.api_url}login/`,data);
  }

  register(data:any){
    return this.http.post(`${this.api_url}register/`,data);
  }

  logout(){
    let user = this.getUserFromLocalStorage();
    console.log(user.token);
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    console.log(headers);
    

    return this.http.post(`${this.api_url}logout/`,null,{headers})
  }

  setUser(user:any){
    this.user = user;
  }



}
