import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NameComponent } from './name/name.component';
import { CoucherComponent } from './coucher/coucher.component';

const routes: Routes = [
  { path: 'name', component: NameComponent },
  { path: 'coucher/:id', component: CoucherComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
