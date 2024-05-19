import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { AuthService } from 'src/app/Services/auth.service';
import { SiteService } from 'src/app/Services/site.service';


interface Message{
  content : string,
  id : number,
  send_date : Date,

}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  teamId: number;
  userList: any[];
  private chatSocket: WebSocket | any;
  receivedMessages: any[] = [];
  user: any;
  message : string = '';


  constructor(private authService: AuthService, @Inject(MAT_DIALOG_DATA) public data: any, private Site:SiteService) {
    this.teamId = data.team_id;
    this.userList = data.userList;

  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.initializeWebSocket();
    console.log(this.user);
    this.Site.getMessages(this.teamId).pipe(take(1)).subscribe((data: any) => {
    this.receivedMessages = data.message;
      console.log(data.message);
    }, (error: any) => {
      console.error(error);
    });
  }

  initializeWebSocket(): void {
    this.chatSocket = new WebSocket('ws://localhost:8000/ws/socket-server/');

    this.chatSocket.onmessage = (event: any) => {
      const messageData = JSON.parse(event.data);
      if (this.teamId == messageData.team) {
        console.log(messageData);
        
        this.receivedMessages.push(messageData);
      }
    };
  }

  send(): void {
    this.chatSocket.send(JSON.stringify({
      'message': this.message,
      'sender': this.user.user_id,
      'teamid': this.teamId
    }));
    this.message = '';
  }
}
