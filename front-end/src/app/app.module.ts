import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule }     from './app-routing.module';

import { AgmCoreModule } from '@agm/core';

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
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAlGkNal4PBED8BOwu2WYrEb-cw2MgsxYQ'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
