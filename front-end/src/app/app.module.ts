import { environment } from '../environments/environment';

//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule }     from './app-routing.module';
import { HttpModule } from '@angular/http';
import { NguiMapModule} from '@ngui/map';
import { FormsModule } from '@angular/forms';
import {Ng2PageScrollModule} from 'ng2-page-scroll';

//providers
import { LoginRouteGuard } from './login-route-guard';
import { AuthService } from './services/auth.service';
import { TripService } from './services/trip.service';
import { WindowRefService } from './services/window-ref.service';

//components
import { AppComponent } from './app.component';
import { NameComponent } from './name/name.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { CoucherComponent } from './coucher/coucher.component';
import { ModalNameComponent } from './modal-name/modal-name.component';
import { ModalCouchComponent } from './modal-couch/modal-couch.component';
import { MaterializeModule } from "angular2-materialize";
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component;
import { LoaderComponent } from './loader/loader.component'';

@NgModule({
  declarations: [
    AppComponent,
    NameComponent,
    UserComponent,
    HomeComponent,
    ModalUserComponent,
    CoucherComponent,
    ModalNameComponent,
    ModalCouchComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponen,
    LoaderComponentt
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpModule,
    Ng2PageScrollModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=' + environment.googleApiKey}),
    MaterializeModule,
  ],
  providers: [LoginRouteGuard, AuthService, TripService, AuthService, WindowRefService],
  bootstrap: [AppComponent]
})
export class AppModule { }
