import { Component, OnInit, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  showVar: boolean = false;
  constructor() { 
  }

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
  }

  ngOnInit() {
  }
}
