import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { SiteService } from 'src/app/Services/site.service';
import { AuthService } from 'src/app/Services/auth.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  teamId: number | any;
  messages: any[] = [];
  newMessage: string = '';
  currentUser: any;
  socket: WebSocket | undefined;

  wsUrl = 'ws://' + environment.backend_url + '/ws/socket-server/'

  constructor(
    private route: ActivatedRoute,
    private service: SiteService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.auth.getUserFromLocalStorage();

    this.loadHistory();
    this.connectWebSocket();
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }

  loadHistory() {
    this.service.getChatHistory(this.teamId).subscribe({
      next: (data: any) => {
        this.messages = data.message || [];
        this.scrollToBottom();
      },
      error: (err) => console.error(err)
    });
  }

  connectWebSocket() {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // check message type in consumers.py
      if (data.type === 'chat') {
        this.messages.push(data);
        this.scrollToBottom();
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.socket) return;
    const payload = {
      message: this.newMessage,
      sender: this.currentUser.user_id,
      teamid: this.teamId
    };

    this.socket.send(JSON.stringify(payload));
    this.newMessage = ''; // Wyczyść input
  }

  isMyMessage(msg: any): boolean {
    const senderId = msg.sender.id || msg.sender.user_id || msg.sender; 
    return senderId == this.currentUser.user_id;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content?.scrollToBottom(300);
    }, 100);
  }
}