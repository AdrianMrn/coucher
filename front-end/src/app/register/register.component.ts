import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userModel = {
    email: "",
    password: "",
  }

  authError: any;

  constructor(private authService:AuthService) { }

  @Output() onRegistered = new EventEmitter();
  register(form: NgForm) {
    this.authError = "";

    if (form.value.username && form.value.password) {
      this.authService.register(form)
        .subscribe((res) => {
          if (res.message) {
            this.authError = res.message;
          } else {
            this.authService.saveToken(res.token);
            this.onRegistered.emit();
          }
        });
    }
  }

  ngOnInit() {
  }

}
