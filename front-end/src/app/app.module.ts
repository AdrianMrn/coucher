import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule }     from './app-routing.module';

import { AppComponent } from './app.component';
import { NameComponent } from './name/name.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { CoucherComponent } from './coucher/coucher.component';

@NgModule({
  declarations: [
    AppComponent,
    NameComponent,
    UserComponent,
    HomeComponent,
    ModalUserComponent,
    CoucherComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
