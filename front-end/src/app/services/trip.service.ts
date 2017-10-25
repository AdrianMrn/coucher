import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TripService {

  apiUrl = 'http://localhost:3000/api';

  constructor(private http:Http) {
    console.log("trip service initialised");
  }

  getTrip() {
    return this.http.get(this.apiUrl + '/trip/59f04c9af36d2855693004dd') //future: this should get the _id from the dashboard
      .map(res => res.json());
  }

  updateTrip(updatedTrip) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/trip', JSON.stringify(updatedTrip), {headers:headers})
      .map(res => res.json());

  }

  deleteTrip(stopid) {
    console.log("kek");
    return this.http.delete(this.apiUrl + '/trip/' + stopid) //future: send both tripid & stopid (in req query?)
      .map(res => res.json());
  }

}
