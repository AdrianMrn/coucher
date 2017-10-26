import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { TripService } from '../services/trip.service';

import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import * as _ from "lodash";

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
  center: any; //future: set to ~switzerland?
  place: any;

  newStop: {
    stopid: Number,
    locationName: String,
    location: [Number],
    couchid: String
  }

  lat: number;
  lng: number;
  
  showVar: boolean = false;

  path: any = [];

  @ViewChild('scrollbox')
  public scrollbox: ElementRef;

  constructor(private tripService:TripService, private ref: ChangeDetectorRef, private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) {
    this.tripService.getTrip()
      .subscribe(trip => {
        this.trip = trip;
        for (var i = 0; i < trip.stops.length; i++) {
          this.path.push({
            lat: trip.stops[i].location[0],
            lng: trip.stops[i].location[1]
          });
        }
      });
  }

  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    var lon = ((place.geometry.viewport.b.b + place.geometry.viewport.b.f)/2);
    var lat = ((place.geometry.viewport.f.b + place.geometry.viewport.f.f)/2);

    //updating the trip
    this.newStop = {
      stopid: Date.now(),
      locationName: place.formatted_address,
      location: [lat, lon],
      couchid: "0"
    }
    
    var updatedTrip = this.trip;
    updatedTrip.stops.push(this.newStop);

    this.tripService.updateTrip(updatedTrip)
      .subscribe(
        () => {
          this.place = '',
          this.scrollContainer(), //future: only run this after this.trip has updated, because we're currently not scrolling all the way down :(
          this.path.push({
            lat: lat,
            lng: lon
          }),
          this.path = _.clone(this.path),
          this.ref.detectChanges()
        }
      );

  }

  scrollContainer() {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#scrolltarget',
      scrollingViews: [this.scrollbox.nativeElement]
    });
    this.pageScrollService.start(pageScrollInstance);
  }

  addPlace(event) {
    event.preventDefault();
    console.log("Press the location you want to add from the autocomplete list.") //future: make this work? --> pressing enter to add the top autocomplete suggestion
  }

  removePlace(id) {
    for(var i = 0; this.trip.stops.length; i++) {
      if(this.trip.stops[i].stopid == id) {
        this.trip.stops.splice(i, 1);
        this.path.splice(i, 1);
        break;
      }
    }
    
    this.tripService.updateTrip(this.trip)
      .subscribe(
        updatedTrip => this.trip = updatedTrip
      );
    
    this.path = _.clone(this.path),
    this.ref.detectChanges()
  }

  toggleChild(){
    this.showVar = !this.showVar;
  }
  
  event() {
    this.showVar = !this.showVar;
  }

  ngOnInit() {
  }
  
}
