import { Component } from '@angular/core';
import { TripService } from './services/trip.service';
import { AuthService } from './services/auth.service';
import { WindowRefService } from './services/window-ref.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TripService, AuthService, WindowRefService],
})
export class AppComponent {
  title = 'app';
}
