import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  @Input() showMePartially: boolean;
  constructor() {
  }

  ngOnInit() {
  }

  // event() {
  // 	this.showMePartially = false;
  // }

}
