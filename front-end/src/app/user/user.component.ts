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

<<<<<<< HEAD
  modalUser = new EventEmitter<string|MaterializeAction>();
  modalLogin = new EventEmitter<string|MaterializeAction>();
  modalRegister = new EventEmitter<string|MaterializeAction>();
  openModal(){
	  this.modalUser.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalUser.emit({action:"modal",params:['close']});
  }

  login() {
    this.modalLogin.emit({action:"modal",params:['open']});
  }

  register() {
    this.modalRegister.emit({action:"modal",params:['open']});
=======
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
    //future: send to name component
  }

  login() {
    this.modalActionsLogin.emit({action:"modal",params:['open']});
    //future: send to name component
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
>>>>>>> 6afdd786e252ceeac6f52c70882ec3aebe470d04
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUsername = this.authService.currentUser();
    }
  }
}
