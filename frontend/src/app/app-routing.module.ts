import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './auth.guard';
import { RoleGuard } from "./role.guard";

import { LoginComponent } from './login/login.component';


import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { AdminFeaturesComponent } from "./admin-features/admin-features.component";
import { AllUsersComponent } from './all-users/all-users.component';
import { AllGpsComponent } from './all-gps/all-gps.component';

import { GPHomeComponent } from "./gphome/gphome.component";

import { HomeComponent } from "./home/home.component";



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard,RoleGuard], data: {expectedRole:'user'}},
    { path: 'adminHome', component: AdminHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'admin'}},
    { path: 'gpHome', component: GPHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'GP'}},

    { path: 'adminFeatures', component: AdminFeaturesComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'admin'}},
    { path: 'all-users', component: AllUsersComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'all-gps', component: AllGpsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    


  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }