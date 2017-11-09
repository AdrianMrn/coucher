import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TripService {

  //future: put apiUrl in .env
  apiUrl = environment.apiUrl;

  constructor(private http:Http, private authService:AuthService) {
    console.log("trip service initialised");
  }

  addTrip(title) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    return this.http.post(this.apiUrl + '/trip', JSON.stringify(title), {headers:headers})
      .map(res => res.json());
  }

  getUserTrips() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    return this.http.get(this.apiUrl + '/trips', {headers:headers})
      .map(res => res.json());
  }

  getTrip(tripid) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    return this.http.get(this.apiUrl + '/trip/' + tripid, {headers:headers}) //future: this should get the _id from the dashboard
      .map(res => res.json());
    /* return this.http.get(this.apiUrl + '/trip/59f04c9af36d2855693004dd', {headers:headers}) //future: this should get the _id from the dashboard
      .map(res => res.json()); */
  }

  updateTrip(updatedTrip) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    return this.http.put(this.apiUrl + '/trip', JSON.stringify(updatedTrip), {headers:headers})
      .map(res => res.json());

  }

  deleteTrip(tripId: any) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    return this.http.delete(this.apiUrl + '/trip/' + tripId, {headers:headers}) //future: send both tripid & stopid (in req query?)
      .map(res => res.json());
  }

  getCouches(stopLocation: any) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    let params = new URLSearchParams();
    let options = {
      lat: stopLocation[0].toString(),
      lon: stopLocation[1].toString(),
      rad: "10"
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/couches?' + params.toString(), {headers:headers})
      .map(res => res.json());
  }

  getCouchDetail(couchid: Number) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    let params = new URLSearchParams();
    let options = {
      couchid: couchid
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/couchdetails?' + params.toString(), {headers:headers})
      .map(res => res.json());
  }

  getHitchhikingSpots(stopLocation: any) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    let params = new URLSearchParams();
    let options = {
      lat: stopLocation[0].toString(),
      lon: stopLocation[1].toString(),
      rad: "10"
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/hitchhikingspots?' + params.toString(), {headers:headers})
      .map(res => res.json());
  }

  getHitchhikingSpotDetail(hwid: Number) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.authService.getToken());

    let params = new URLSearchParams();
    let options = {
      hwid: hwid
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/hitchhikingspotdetails?' + params.toString(), {headers:headers})
      .map(res => res.json());
  }

}
