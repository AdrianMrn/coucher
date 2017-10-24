import { Injectable } from '@angular/core';

import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TripService {

  constructor(private http:Http) {
    console.log("trip service initialised");
  }

  getTrip() {
    return this.http.get('http://localhost:3000/api/trip/59ef2af8fa0ee1fea40f6f0a')
      .map(res => res.json());
  }

}
