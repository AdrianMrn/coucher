import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  userModel = {
    username: "",
    password: "",
  }

  authError: any;

  constructor(private authService:AuthService) { }

  register(form: NgForm) {
    this.authError = "";

    if (form.value.username && form.value.password) {
      this.authService.register(form)
        .subscribe((res) => {
          console.log(res);
          if (res.message) {
            this.authError = res.message;
          } else {
            console.log(res);
            this.authService.saveToken(res.token);
          }
        });
    }
  }

  ngOnInit() {
  }

}
