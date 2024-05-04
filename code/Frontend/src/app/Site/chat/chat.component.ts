import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  teamId : number  = 0;
  private chatSocket : WebSocket | any;
  receivedMessages: any[] = [];
  user: any;

  constructor(private authService: AuthService,private route:ActivatedRoute)
  {

  }
  ngOnInit(): void {
    this.teamId = this.route.snapshot.params['id'];
    this.user = this.authService.getUserFromLocalStorage()
    this.initializeWebSocket()
  }

  initializeWebSocket(): void {
    this.chatSocket = new WebSocket('ws://localhost:8000/ws/socket-server/');

    this.chatSocket.onmessage = (event:any) => {
      const messageData = JSON.parse(event.data);
      this.receivedMessages.push(messageData);
      console.log(messageData)
    };
  }


  send(message: string): void {
    this.chatSocket.send(JSON.stringify({
      'message':message,
      'sender': this.user.user_id,
      'teamid' : this.teamId
    }));
  }

}
