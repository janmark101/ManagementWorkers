import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http:HttpClient,private Auth: AuthService) { }
  api_url = 'http://localhost:8000/api/'


  getUserTeams(){

    let user = this.Auth.getUserFromLocalStorage();
    console.log(user);
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    console.log(headers);
    

    return this.http.get(`${this.api_url}teams/`,{headers})
  }


  createTeam(data:any){
    let user = this.Auth.getUserFromLocalStorage();
    console.log(user);
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    console.log(headers);
    

    return this.http.post(`${this.api_url}teams/`,data,{headers})
  }

  joinTeam(data:any){
    let user = this.Auth.getUserFromLocalStorage();
    console.log(user);
    
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    console.log(headers);
    

    return this.http.post(`${this.api_url}teams/`,data,{headers})
  }


}
