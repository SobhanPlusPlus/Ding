import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

import { timer } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  private _hubConnection: HubConnection;
  message = '';
  messages:any=[];

  GroupName: '';
  UserName = '';
  Conected = true;
  ShowLoader = true;

  title = ' SignarlR';


  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.StartSocket();
  }

  public sendMessage(): void {
    const data = `Me : ${this.message}`;

    this._hubConnection.invoke('SedndMessageGroupExceptCurentUser', this.GroupName, this.message);
    this.messages.push({message : this.message, type : true});
    console.log(this.messages);
    this.message='';
  }
  // tslint:disable-next-line:typedef
  scroll() {
    const myDiv = document.querySelector("#scroll")
    myDiv.scrollIntoView();
  }


  Login(): void {
    const data = this.UserName;
    this.Conected = true;
    this.ShowLoader = true;
  }


  // tslint:disable-next-line:typedef
  StartSocket() {

    this._hubConnection = new HubConnectionBuilder().withUrl('https://localhost:44300/chathub')
      .build();

    this._hubConnection.on('ReceiveMessage', (data: any) => {

      console.log(data);

      if (data.status === 4) {
        this.ShowLoader = false;
        this.GroupName = data.groupName;
          }

     else if (data.status === 1) {
        const received = `Received: ${data}`;
        this.messages.push({message : data.message, type : false});
        console.log(this.messages);

      }
    });

    this._hubConnection.start()
      .then(() => {
        console.log('Hub connection started');
      })
      .catch(err => {
        console.log('Error while establishing connection');
      });

  }
}
