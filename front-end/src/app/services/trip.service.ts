import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TripService {

  apiUrl = 'http://localhost:3000/api';

  constructor(private http:Http) {
    console.log("trip service initialised");
  }

  getTrip(/* tripid */) {
    return this.http.get(this.apiUrl + '/trip/59f04c9af36d2855693004dd') //future: this should get the _id from the dashboard
      .map(res => res.json());
  }

  updateTrip(updatedTrip/* :trip (import trip first) */) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/trip', JSON.stringify(updatedTrip), {headers:headers})
      .map(res => res.json());

  }

  deleteTrip(stopid: Number) {
    return this.http.delete(this.apiUrl + '/trip/' + stopid) //future: send both tripid & stopid (in req query?)
      .map(res => res.json());
  }

  getCouches(stopLocation: [Number, Number]) {
    let params = new URLSearchParams();
    let options = {
      lat: stopLocation[0].toString(),
      lon: stopLocation[1].toString(),
      rad: "10"
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/couches?' + params.toString())
      .map(res => res.json());
  }

  getHitchhikingSpots(stopLocation: any) {
    let params = new URLSearchParams();
    let options = {
      lat: stopLocation[0].toString(),
      lon: stopLocation[1].toString(),
      rad: "10"
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/hitchhikingspots?' + params.toString())
      .map(res => res.json());
  }

  getHitchhikingSpotDetail(hwid: Number) {
    let params = new URLSearchParams();
    let options = {
      hwid: hwid
    };
    for(let key in options){
      params.set(key, options[key]) 
    }

    return this.http.get(this.apiUrl + '/hitchhikingspotdetails?' + params.toString())
      .map(res => res.json());
  }

}
