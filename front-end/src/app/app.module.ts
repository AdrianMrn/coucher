import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule }     from './app-routing.module';

import { HttpModule } from '@angular/http';
import { NguiMapModule} from '@ngui/map';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NameComponent } from './name/name.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { CoucherComponent } from './coucher/coucher.component';
import { ModalNameComponent } from './modal-name/modal-name.component';
import { ModalCouchComponent } from './modal-couch/modal-couch.component';


@NgModule({
  declarations: [
    AppComponent,
    NameComponent,
    UserComponent,
    HomeComponent,
    ModalUserComponent,
    CoucherComponent,
    ModalNameComponent,
    ModalCouchComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpModule,
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?libraries=places,geocoder&key=AIzaSyDDWi5pi9uJM4vNN-7pCN2DzUysCnl7Jlc'}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
