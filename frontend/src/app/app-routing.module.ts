import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from './login/login.component';
import { HomeComponent } from "./home/home.component";
import { AuthGuard } from './auth.guard';
import { AdminGuard } from "./admin.guard";
import { AdminHomeComponent } from "./admin-home/admin-home.component";





export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'adminHome', component: AdminHomeComponent, canActivate: [AuthGuard, AdminGuard]},


  
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }