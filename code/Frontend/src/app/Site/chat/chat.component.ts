import { Component, OnInit } from '@angular/core';
import { webSocket } from 'rxjs/webSocket'
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  
  user: any;
  constructor(private authService: AuthService)
  {

  }
  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage()
    console.log(this.user);
    
  }

  url = `ws://localhost:8000/ws/socket-server/`
  chatSocket = new WebSocket(this.url);

  send(message: string): void {
    this.chatSocket.send(JSON.stringify({
      'message':message,
      'sender': this.user.user_id
    }));
  }

}
