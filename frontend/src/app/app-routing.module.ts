import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './auth.guard';
import { RoleGuard } from "./role.guard";

import { LoginComponent } from './login/login.component';
import { HomeComponent } from "./home/home.component";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { GPHomeComponent } from "./gphome/gphome.component";







export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard,RoleGuard], data: {expectedRole:'user'}},
    { path: 'adminHome', component: AdminHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'admin'}},
    { path: 'gpHome', component: GPHomeComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole:'GP'}},


  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }