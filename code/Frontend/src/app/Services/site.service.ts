import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import jsPDF from 'jspdf';
@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private http:HttpClient) {

   }

  api_url = 'http://' + environment.backend_url + '/api/'
  chat_url = 'http://' + environment.backend_url + '/chat/'

  getUserFromLocalStorage() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  getAuthHeaders() {
    let user = this.getUserFromLocalStorage();
    const headers = new HttpHeaders({
      'Authorization': `Token ${user.token}`
    });

    return headers;
  }

  getUserTeams(){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/`, {headers})
  }


  createTeam(data:any){
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}teams/`, data, {headers})
  }

  joinTeam(code:any){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/join/${code}/`, {headers})
  }

  getTeamName(id:number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/${id}/name/`, {headers})
  }

  getTaskForTeam(id:number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/${id}/tasks/`, {headers})
  }

  addTaskForTeam(id:number, data:any){
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}teams/${id}/tasks/`, data, {headers})
  }

  getUsersForTeam(id:number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/${id}/users/`, {headers})
  }

  deleteTask(taskId: number,teamId : number){
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.api_url}teams/${teamId}/task/${taskId}/`, {headers});
  }

  getTask(taskId: number,teamId:number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/${teamId}/task/${taskId}`, {headers});
  }

  editTask(taskId: number,teamId : number,data:any){
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.api_url}teams/${teamId}/task/${taskId}/`, data, {headers});
  }

  UniqueCode(teamId: number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/${teamId}/uniquecode/`, {headers});
  }

  RegenerateUniqueCode(teamId: number){
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}teams/${teamId}/uniquecode/`, null, {headers});
  }

  deleteTeam(teamId: number){
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.api_url}teams/${teamId}/`, {headers});
  }

  removeUserFromTeam(teamId:number,userID:number){
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}teams/${teamId}/removeuser/${userID}/`, null, {headers});
  }

  leaveTeam(teamId:number){
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}teams/${teamId}/`, null, {headers});
  }

  changeTaskStatus(teamId:number,data:any,taskId:number){
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}teams/${teamId}/task/${taskId}/changestatus/`, data, {headers});
  } 

  AddingLink(teamId:number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.api_url}teams/${teamId}/addinglink/`, {headers});
  } 

  getChatHistory(teamId:number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.chat_url}team/${teamId}/`, {headers});
  }

  generatePdf(teamName:string, members:any, tasks:any) {
    
    const doc = new jsPDF();

    // Nagłówek z nazwą zespołu
    doc.setFontSize(16);
    
    const teamNameText = 'Raport for: ' + teamName;
    const teamNameWidth = doc.getStringUnitWidth(teamNameText) * 16 / doc.internal.scaleFactor;
    const marginLeft = (doc.internal.pageSize.width - teamNameWidth) / 2; // Wyliczenie marginesu na środku
    doc.text(teamNameText, marginLeft, 10);
    doc.setFontSize(12);
    doc.text("Number of workers: " + members.length, 10, 30);
    const currentDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const currentMonth = monthNames[currentDate.getMonth()];
    doc.text("Month: " + currentMonth, 10, 20);
    
   
    doc.setFontSize(12);
    let y = 50;
    members.forEach((member:any) => {
        doc.text("Worker: " + member.first_name + " " +member.last_name, 10, y);
        y += 10;
        doc.text("Tasks:", 15, y);
        y += 5;
        tasks.forEach((task:any) => {
            if (task.workers_id.includes(member.id)){
              doc.text("- " + task.name+ "      ["+ task.status+ "] ", 20, y);
              y += 5;
            }  
        });
        y += 5;
    });

    doc.save('team_report.pdf');
  }

  saveDeviceToken(token: string) {
    const payload = {
      registration_id: token, // firebase token
      type: 'android',
      active: true
    };

    const headers = this.getAuthHeaders();
    return this.http.post(`${this.api_url}devices/`, payload, { headers });
  }

}
