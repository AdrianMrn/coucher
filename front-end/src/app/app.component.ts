import { Component } from '@angular/core';
import { TripService } from './services/trip.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TripService],
})
export class AppComponent {
  title = 'app';
}
