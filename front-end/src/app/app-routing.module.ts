import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginRouteGuard } from './login-route-guard';

import { HomeComponent } from './home/home.component';
import { NameComponent } from './name/name.component';
import { CoucherComponent } from './coucher/coucher.component';


const routes: Routes = [
  { path: 'name', component: NameComponent, canActivate: [LoginRouteGuard] },
  { path: 'coucher/:id', component: CoucherComponent, canActivate: [LoginRouteGuard] },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}