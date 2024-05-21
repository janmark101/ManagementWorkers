import { Component, OnInit, Inject,ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('chatMessagesContainer') private chatMessagesContainer!: ElementRef;
  data_array : any = [];

  
  

  constructor(private authService: AuthService, @Inject(MAT_DIALOG_DATA) public data: any, private Site:SiteService) {
    this.teamId = data.team_id;
    this.userList = data.userList;

  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.initializeWebSocket();
    console.log(this.user);
    this.Site.getMessages(this.teamId).pipe(take(1)).subscribe((data: any) => {
      console.log(data.message);
      
    this.receivedMessages = data.message;
    //this.add_data_to_array();
    this.processMessages();

    }, (error: any) => {
      console.error(error);
    });

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


  initializeWebSocket(): void {
    this.chatSocket = new WebSocket('ws://localhost:8000/ws/socket-server/');

    this.chatSocket.onmessage = (event: any) => {
      const messageData = JSON.parse(event.data);
      if (this.teamId == messageData.team) {
        this.receivedMessages.push(messageData);
        this.processMessages();
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

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  add_data_to_array(){
    this.data_array.push(this.receivedMessages[0].send_date.split('T')[0]);
    console.log(this.data_array);
    this.receivedMessages.forEach(item=>{
      let formatted_data = item.send_date.split('T')[0]
      if (formatted_data != this.data_array[this.data_array.length - 1]){
        this.data_array.push(formatted_data);
        
      }
      console.log(item.send_date);
    });
    console.log(this.data_array);
    
  }

  check_date(date:any){
    let date_formatted = date.send_date.split('T')[0];
    
    if (this.counter_date == this.data_array.length){
      return false
    }

    if (date_formatted == this.data_array[this.counter_date]){
      //this.counter_date+=1;
      return true
    }
    else{
      return false
    }

  }

  processedMessages: any[] = [];
  counter_date: number = 0;
  //data_array: string[] = [];

  processMessages(): void {
    let lastDate = '';
    this.processedMessages = this.receivedMessages.map(message => {
      const dateFormatted = message.send_date.split('T')[0];
      const showDate = dateFormatted !== lastDate;
      if (showDate) {
        this.data_array.push(dateFormatted);
        this.counter_date += 1; 
        lastDate = dateFormatted;
      }
      return { ...message, showDate };
    });
  }

}
