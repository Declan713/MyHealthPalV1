import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './auth.guard';
import { RoleGuard } from "./role.guard";

import { LoginComponent } from './login/login.component';


import { AdminHomeComponent } from "./Homes/admin-home/admin-home.component";

import { AllUsersComponent } from './Admin-Features/all-users/all-users.component';
import { AllGpsComponent } from './Admin-Features/all-gps/all-gps.component';
import { AdminProfileComponent } from "./Profiles/admin-profile/admin-profile.component";

import { GPHomeComponent } from "./Homes/gp-home/gp-home.component";
import { GpProfileComponent } from "./Profiles/gp-profile/gp-profile.component";

import { HomeComponent } from "./Homes/user-home/user-home.component";
import { UserProfileComponent } from "./Profiles/user-profile/user-profile.component";
import { AllItemsComponent } from "./Admin-Features/all-items/all-items.component";



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard,RoleGuard], data: {expectedRole:'user'}},
    { path: 'adminHome', component: AdminHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'admin'}},
    { path: 'gpHome', component: GPHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'GP'}},

    
    { path: 'all-users', component: AllUsersComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'all-gps', component: AllGpsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'admin-profile', component: AdminProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'item-functions', component: AllItemsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},


    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},

    {path: 'gp-profile', component: GpProfileComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'GP'}}


  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }