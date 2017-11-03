import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';

@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor(private authService: AuthService) {}

  canActivate() {
    return this.authService.isLoggedIn();
  }
}