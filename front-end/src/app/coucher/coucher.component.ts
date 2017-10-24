import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TripService } from '../services/trip.service';

import { Trip } from '../../Trip';

import { NguiMapComponent } from '@ngui/map';
NguiMapComponent['apiUrl'] =
'https://maps.google.com/maps/api/js?libraries=visualization,places';

@Component({
  selector: 'app-coucher',
  templateUrl: './coucher.component.html',
  styleUrls: ['./coucher.component.scss']
})
export class CoucherComponent implements OnInit {
  public positions= [];
  trip: Trip;

  autocomplete: any;
  address: any = {};
  center: any;

  lat: number;
  lng: number;

  constructor(private tripService:TripService, private ref: ChangeDetectorRef) {

    /* this.tripService.getTrip()
      .subscribe(trip => {
        this.trip = trip;
        console.log(this.trip);
      }); */

  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }
    this.ref.detectChanges();
  }

  ngOnInit() {
  }

}
