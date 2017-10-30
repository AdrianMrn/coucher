import { Component, ElementRef, Input, OnInit, OnDestroy  } from '@angular/core';

import { TripService } from '../services/trip.service';

@Component({
  selector: 'app-modal-name',
  templateUrl: './modal-name.component.html',
  styleUrls: ['./modal-name.component.scss']
})
export class ModalNameComponent implements OnInit {
  @Input() showMePartially: boolean;
  constructor(private tripService:TripService) { }

  addTrip(title) {
    console.log(title);
    /* this.tripService.addTrip() */
  }

  ngOnInit() {
  }

}
