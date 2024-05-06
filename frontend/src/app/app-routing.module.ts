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
import { GpAppointmentsComponent } from "./Gp-Features/gp-appointments/gp-appointments.component";

import { HomeComponent } from "./Homes/user-home/user-home.component";
import { UserProfileComponent } from "./Profiles/user-profile/user-profile.component";
import { AllItemsComponent } from "./Admin-Features/all-items/all-items.component";
import { ViewItemComponent } from "./Admin-Features/view-item/view-item.component";
import { AllUserItemsComponent } from "./User-Features/all-user-items/all-user-items.component";
import { ItemComponent } from "./User-Features/item/item.component";
import { UserAppointmentsComponent } from "./User-Features/user-appointments/user-appointments.component";
import { UserBasketComponent } from "./User-Features/user-basket/user-basket.component";
import { UserBookingComponent } from "./User-Features/user-booking/user-booking.component";
import { GpPatientsComponent } from "./Gp-Features/gp-patients/gp-patients.component";



export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard,RoleGuard], data: {expectedRole:'user'}},
    { path: 'adminHome', component: AdminHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'admin'}},
    { path: 'gpHome', component: GPHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'GP'}},

    // Admin Only Page Paths 
    { path: 'all-users', component: AllUsersComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'all-gps', component: AllGpsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'admin-profile', component: AdminProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'item-functions', component: AllItemsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},
    { path: 'item/:id', component: ViewItemComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' }},

    // User Only Page Paths
    { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},
    { path: 'all-user-items', component: AllUserItemsComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},
    { path: 'view-item/:id', component: ItemComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},
    { path: 'user-appointments', component: UserAppointmentsComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},
    { path: 'user-basket', component: UserBasketComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},
    { path: 'user-booking', component: UserBookingComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'user'}},

    // GP Only Page Paths
    {path: 'gp-profile', component: GpProfileComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'GP'}},
    {path: 'gp-appointments', component: GpAppointmentsComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'GP'}},
    {path: 'gp-patients', component: GpPatientsComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: 'GP'}}



  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }