import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

import { WindowRefService } from './window-ref.service';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

import { NgForm } from '@angular/forms';

@Injectable()
export class AuthService {

  //future: put apiUrl in .env
  apiUrl = environment.apiUrl;

  private _window: Window;

  constructor(private http:Http, private windowRef:WindowRefService) {
    console.log("auth service initialised");
    this._window = windowRef.nativeWindow;
  }


  saveToken = function (token) {
    this._window.localStorage['mean-token'] = token;
  };
  getToken = function () {
    return this._window.localStorage['mean-token'];
  };
  logout = function() {
    this._window.localStorage.removeItem('mean-token');
  };

  isLoggedIn = function() {
    var token = this.getToken();
    var payload;
  
    if(token){
      payload = token.split('.')[1];
      payload = this._window.atob(payload);
      payload = JSON.parse(payload);
  
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  currentUser = function() {
    if(this.isLoggedIn()){
      var token = this.getToken();
      var payload = token.split('.')[1];
      payload = this._window.atob(payload);
      payload = JSON.parse(payload);
      /* return {
        username : payload.username
      }; */
      return payload.username;
    }
  };

  register(form: NgForm) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/register', JSON.stringify(form.value), {headers:headers})
      .map(res => res.json());

    /* return this.http.post(this.apiUrl + '/register', JSON.stringify(form.value), {headers:headers})
      .map(res => res.json()); */
  }

  login(form: NgForm) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/login', JSON.stringify(form.value), {headers:headers})
      .map(res => res.json());
  }

}
