import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import * as _ from "lodash";
import { MaterializeModule, MaterializeAction } from "angular2-materialize";

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
  center: any; //future: set to ~switzerland?
  place: any;

  newStop: {
    stopid: Number,
    locationName: String,
    location: [Number],
    couchid: String
  }
  newhhSpot: {
    spotid: Number
  }

  mapzoom: Number = 5;

  stopName: String;

  couches: any; //future: write a model for this

  hitchhikingSpots: any; //future: write a model for this

  hitchhikingSpotMarker = {
    hwid: null
  };
  hitchhikingSpotDetail: any;
  pickingHhspotForStopIndex: number;

  lat: Number;
  lng: Number;


  path: any = [];

  modalCouches = new EventEmitter<string|MaterializeAction>();

  @ViewChild('scrollbox')
  public scrollbox: ElementRef;

  constructor(private route:ActivatedRoute, private router:Router, private tripService:TripService, private ref:ChangeDetectorRef, private pageScrollService:PageScrollService, @Inject(DOCUMENT) private document:any) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tripService.getTrip(params['id'])
      .subscribe(trip => {
        this.trip = trip;
        for (var i = 0; i < trip.stops.length; i++) {
          this.path.push({
            lat: trip.stops[i].location[0],
            lng: trip.stops[i].location[1]
          });
        };
      });
    });
  }

  //place-related stuff
  placeChanged(place) {
    this.hitchhikingSpots = [];

    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    var lon = place.geometry.location.lng();
    var lat = place.geometry.location.lat();

    //updating the trip
    this.newStop = {
      stopid: Date.now(),
      locationName: place.formatted_address,
      location: [lat, lon],
      couchid: "0"
    }
    this.newhhSpot = {
      spotid: 0
    }
    
    var updatedTrip = this.trip;
    updatedTrip.stops.push(this.newStop);
    updatedTrip.hitchhikingSpots.push(this.newhhSpot);

    this.tripService.updateTrip(updatedTrip)
      .subscribe(
        () => {
          this.place = '',
          this.scrollContainer(), //future: only run this after this.trip has updated, because we're currently not scrolling all the way down :(
          this.path.push({
            lat: lat,
            lng: lon
          });
          this.path = _.clone(this.path);
          this.ref.detectChanges();
        }
      );

  }

  addPlace(event) {
    event.preventDefault();
    console.log("Press the location you want to add from the autocomplete list.") //future: make this work? --> pressing enter to add the top autocomplete suggestion
  }

  removePlace(id) {
    this.hitchhikingSpots = [];

    for(var i = 0; this.trip.stops.length; i++) {
      if(this.trip.stops[i].stopid == id) {
        this.trip.stops.splice(i, 1);
        this.trip.hitchhikingSpots.splice(i, 1);
        this.path.splice(i, 1);
        break;
      }
    }
    
    this.tripService.updateTrip(this.trip)
      .subscribe(
        updatedTrip => this.trip = updatedTrip
      );
    
    this.path = _.clone(this.path);
    this.ref.detectChanges();
  }

  //couches related stuff
  showCouches(stopLocation: [Number, Number], stopName: String){
    this.stopName = stopName;
    this.tripService.getCouches(stopLocation)
      .subscribe(
        couches => {
          this.couches = couches;
          this.openModalcouches();
          //future: if (!this.couches.length) {toast message that no couches were found?}
        });

    this.ref.detectChanges();
  }

  //hitchhiking related stuff
  showHitchhikingSpots(stopid: number){
    this.hitchhikingSpots = [];
    
    this.pickingHhspotForStopIndex = stopid;
    var stopLocation = this.trip.stops[stopid].location;

    this.tripService.getHitchhikingSpots(stopLocation)
      .subscribe(
        hitchhikingSpots => {
          this.hitchhikingSpots = hitchhikingSpots;
          this.center = {lat:stopLocation[0],lng:stopLocation[1]};
          this.mapzoom = 12;

          this.ref.detectChanges();
        });
  }

  clickedHhspot({target: marker}, hwid) {
    this.hitchhikingSpotMarker.hwid = hwid;

    this.tripService.getHitchhikingSpotDetail(hwid)
    .subscribe(
      hhspotDetail => {
        this.hitchhikingSpotDetail = hhspotDetail
      }
    );
    
    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }

  pickHhspot() {
    this.hitchhikingSpots = [];
    
    this.trip.hitchhikingSpots[this.pickingHhspotForStopIndex].spotid = this.hitchhikingSpotMarker.hwid;

    this.tripService.updateTrip(this.trip)
      .subscribe(
        () => {
          if (this.pickingHhspotForStopIndex+2 < this.trip.stops.length) {
            this.showHitchhikingSpots(this.pickingHhspotForStopIndex+1);
          }
        }
      );
  }
  
  //misc
  scrollContainer() {
    const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
      document: this.document,
      scrollTarget: '#scrolltarget',
      scrollingViews: [this.scrollbox.nativeElement]
    });
    this.pageScrollService.start(pageScrollInstance);
  }

  openModalcouches() {
    this.modalCouches.emit({action:"modal",params:['open']});
  }
  closeModalcouches() {
    this.modalCouches.emit({action:"modal",params:['close']});
  }

  
}
