import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  isLoggedIn: any;
  currentUsername: any;

  constructor(private authService:AuthService) {
  }

  modalActionsLogin = new EventEmitter<string|MaterializeAction>();
  modalActionsProfile = new EventEmitter<string|MaterializeAction>();
  modalActionsRegister = new EventEmitter<string|MaterializeAction>();
  
  openModal(){
    if (!this.isLoggedIn) {
      this.login();
      return;
    }
    this.modalActionsProfile.emit({action:"modal",params:['open']});
  }

  register() {
    this.modalActionsLogin.emit({action:"modal",params:['close']});
    this.modalActionsRegister.emit({action:"modal",params:['open']});
  }

  login() {
    this.modalActionsLogin.emit({action:"modal",params:['open']});
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUsername = "";
    this.modalActionsProfile.emit({action:"modal",params:['close']});
  }

  loggedIn() {
    this.modalActionsLogin.emit({action:"modal",params:['close']});
    this.modalActionsRegister.emit({action:"modal",params:['close']});
    this.isLoggedIn = true;
    this.currentUsername = this.authService.currentUser();
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUsername = this.authService.currentUser();
    }
  }
}
