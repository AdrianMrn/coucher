import { Component, OnInit } from '@angular/core';

import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {

  overlay: boolean = false;
  constructor(private tripService:TripService) { }

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
      this.tripService.addTrip(title);

    }
  }
  
  ngOnInit() {
  }

}
