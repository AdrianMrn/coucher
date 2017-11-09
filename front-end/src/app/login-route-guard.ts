import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(private authService: AuthService, private router:Router) {}

  canActivate() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    } else {
      return this.authService.isLoggedIn();
    }
  }
}