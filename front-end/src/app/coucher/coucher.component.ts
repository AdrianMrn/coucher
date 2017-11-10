import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { saveAs } from 'file-saver';

import * as _ from "lodash";
import 'materialize-css';
import { MaterializeModule, MaterializeAction, MaterializeDirective } from "angular2-materialize";

import { AuthService } from '../services/auth.service';
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
  @Input() loading: boolean = true;
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

  couchMarker = {
    id: null
  };
  couchDetail: any;
  pickingCouchForStopIndex: number;

  infoWindowMarker: any;

  lat: Number;
  lng: Number;

  path: any = [];

  modalCouches = new EventEmitter<string|MaterializeAction>();

  actionToastMapClick = new EventEmitter<string|MaterializeAction>();
  actionToastInputSubmit = new EventEmitter<string|MaterializeAction>();
  actionToastNoHhSpots = new EventEmitter<string|MaterializeAction>();

  @ViewChild('scrollbox')
  public scrollbox: ElementRef;

  constructor(private authService: AuthService, private route:ActivatedRoute, private router:Router, private tripService:TripService, private ref:ChangeDetectorRef, private pageScrollService:PageScrollService, @Inject(DOCUMENT) private document:any) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }

  onMapReady(map) {
    this.loading = false;
  }

  ngOnInit() {
        console.log(this);
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

  exportPdf() {
    this.tripService.exportTrip(this.trip._id, this.trip.name)
      .subscribe(
        res => {
          console.log('end download');
        });
  }

  //place-related stuff
  placeChosen(place) {
    this.addPlace(null, place);
  }

  onMapClick(event) {
    if (event instanceof MouseEvent) return;

    if (this.infoWindowMarker) {
      this.infoWindowMarker.nguiMapComponent.closeInfoWindow('iwcouch');
      this.infoWindowMarker.nguiMapComponent.closeInfoWindow('iwhhspot');
    }
    
    this.actionToastMapClick.emit('toast');
  }

  addPlace(event, place) {
    if (event) {
      event.preventDefault();
      this.actionToastInputSubmit.emit('toast');
      return;
    }

    this.couches = [];
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

  removePlace(id) {
    this.couches = [];
    this.hitchhikingSpots = [];

    //removing stop from stops, hitchhikingspots & path
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
  showCouches(stopid: number){
    this.couches = [];
    this.hitchhikingSpots = [];
    
    this.pickingCouchForStopIndex = stopid;
    var stopLocation = this.trip.stops[stopid].location;

    this.tripService.getCouches(stopLocation)
      .subscribe(
        couches => {
          this.couches = couches;
          this.center = {lat:stopLocation[0],lng:stopLocation[1]};
          this.mapzoom = 12;
          //this.openModalcouches();

          if (this.couches.length < 1) {
            this.actionToastNoHhSpots.emit('toast'); //future: create toast for no couches
          }

          this.ref.detectChanges();
        });
  }

  clickedCouch({target: marker}, id) {
    this.couchMarker.id = id;

    this.tripService.getCouchDetail(id)
    .subscribe(
      couchDetail => {
        this.couchDetail = couchDetail
      }
    );
    
    this.infoWindowMarker = marker;
    marker.nguiMapComponent.openInfoWindow('iwcouch', marker);
  }

  pickCouch() {
    this.couches = [];
    this.hitchhikingSpots = [];
    
    this.trip.stops[this.pickingCouchForStopIndex].couchid = this.couchMarker.id;

    this.tripService.updateTrip(this.trip)
      .subscribe(
        () => {
          if (this.pickingCouchForStopIndex+2 < this.trip.stops.length) {
            this.showCouches(this.pickingCouchForStopIndex+1);
          }
        }
      );
  }

  //hitchhiking related stuff
  showHitchhikingSpots(stopid: number){
    this.couches = [];
    this.hitchhikingSpots = [];
    
    this.pickingHhspotForStopIndex = stopid;
    var stopLocation = this.trip.stops[stopid].location;

    this.tripService.getHitchhikingSpots(stopLocation)
      .subscribe(
        hitchhikingSpots => {
          this.hitchhikingSpots = hitchhikingSpots;
          this.center = {lat:stopLocation[0],lng:stopLocation[1]};
          this.mapzoom = 12;

          if (this.hitchhikingSpots.length < 1) {
            this.actionToastNoHhSpots.emit('toast');
          }

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
    
    this.infoWindowMarker = marker;
    marker.nguiMapComponent.openInfoWindow('iwhhspot', marker);
  }

  pickHhspot() {
    this.couches = [];
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
