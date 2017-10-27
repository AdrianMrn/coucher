import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { TripService } from '../services/trip.service';

import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

import * as _ from "lodash";
import { MaterializeModule, MaterializeAction } from "angular2-materialize";

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
  
  showVar: Boolean = false;

  path: any = [];

  modalCouches = new EventEmitter<string|MaterializeAction>();

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
        };
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

  showCouches(stopLocation: [Number, Number], stopName: String){
    this.stopName = stopName;
    this.tripService.getCouches(stopLocation)
      .subscribe(
        couches => {
          this.couches = couches;
          /* this.showVar = !this.showVar; */
          this.openModalcouches();
          console.log(this.couches);
          //future: if (!this.couches.length) {toast message that no couches were found?}
        });

    this.ref.detectChanges();
  }

  showHitchhikingSpots(stopLocation: [Number, Number], stopid: number){
    this.pickingHhspotForStopIndex = stopid;

    this.tripService.getHitchhikingSpots(stopLocation)
      .subscribe(
        hitchhikingSpots => {
          this.hitchhikingSpots = hitchhikingSpots;
          console.log(this.hitchhikingSpots);
          this.center = {lat:stopLocation[0],lng:stopLocation[1]};
          this.mapzoom = 12;
          //future:
          /*
          -zoom on map
          -show radius circle around location https://rawgit.com/ng2-ui/map/master/app/index.html#/simple-circle
          -show hitchhikingSpots on map with (custom?) markers https://rawgit.com/ng2-ui/map/master/app/index.html#/custom-marker-ng-for
          -make markers clickable with infobox to show basic info (rating, ...?) & allow user to pick this spot https://rawgit.com/ng2-ui/map/master/app/index.html#/simple-info-window
          
          to hide markers: just empty this.hitchhikingspots & run ref.detectChanges? when should markers be hidden?
          */
          this.ref.detectChanges();
        });
  }

  clickedHhspot({target: marker}, hwid) {
    this.hitchhikingSpotMarker.hwid = hwid;

    this.tripService.getHitchhikingSpotDetail(hwid)
    .subscribe(
      hhspotDetail => {
        this.hitchhikingSpotDetail = hhspotDetail
        console.log(this.hitchhikingSpotDetail);
      }
    );
    
    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }

  pickHhspot() {
    this.trip.hitchhikingSpots[this.pickingHhspotForStopIndex].spotid = this.hitchhikingSpotMarker.hwid;

    this.tripService.updateTrip(this.trip)
      .subscribe();
  }
  

  event() {
    this.showVar = !this.showVar;
  }

  openModalcouches() {
    this.modalCouches.emit({action:"modal",params:['open']});
  }
  closeModalcouches() {
    this.modalCouches.emit({action:"modal",params:['close']});
  }

  ngOnInit() {
  }
  
}
