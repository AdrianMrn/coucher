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
    return this.http.get(this.apiUrl + '/trip/59ef2af8fa0ee1fea40f6f0a')
      .map(res => res.json());
  }

  updateTrip(updatedTrip) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/trip', JSON.stringify(updatedTrip), {headers:headers})
      .map(res => res.json());

  }

}
