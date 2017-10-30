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

  modalActions1 = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();
  modalActions3 = new EventEmitter<string|MaterializeAction>();
  openModal(){
	  this.modalActions2.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalActions2.emit({action:"modal",params:['close']});
  }

  login() {
    this.modalActions1.emit({action:"modal",params:['open']});
  }

  register() {
    this.modalActions3.emit({action:"modal",params:['open']});
  }

  ngOnInit() {
  }
}
