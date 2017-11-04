import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  currentUsername: any;

  constructor(private authService:AuthService) {
  }

  @Output() onLogout = new EventEmitter();
  logout() {
    this.onLogout.emit();
  }

  ngOnInit() {
    this.currentUsername = this.authService.currentUser();
  }
}
