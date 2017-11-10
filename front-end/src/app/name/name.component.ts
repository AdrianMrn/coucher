import { Component, OnInit } from '@angular/core';

import { TripService } from '../services/trip.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {

  trips: any = [];
  title: any;

  overlay: boolean = false;
  constructor(private tripService:TripService, private authService:AuthService) { }

  showOverlay(){
    if (!this.overlay) {
      this.overlay = !this.overlay;
    }
  }
  hideOverlay(){
    if (this.overlay) {
      this.overlay = !this.overlay;
    }
  }

  createTrip(title: String) {
    if (title) {
      this.hideOverlay();
      this.tripService.addTrip({"name":title})
        .subscribe(res => {
          this.trips.push(res);
          this.title = "";
        });
    }
  }

  deleteTrip(tripId: any) {
    if (tripId) {
      this.tripService.deleteTrip(tripId)
        .subscribe(res => {
          for(var i = 0; this.trips.length; i++) {
            if(this.trips[i]._id == tripId) {
              this.trips.splice(i, 1);
              break;
            }
          }
        });
    }
  }
  
  ngOnInit() {
    this.tripService.getUserTrips()
      .subscribe(res => {
        this.trips = res;
      });
  }

}
