import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';

import { AllUsersComponent } from './Admin-Features/all-users/all-users.component'; 
import { AllGpsComponent } from './Admin-Features/all-gps/all-gps.component';
import { AllItemsComponent } from './Admin-Features/all-items/all-items.component';
import { ViewItemComponent } from './Admin-Features/view-item/view-item.component';

import { AdminProfileComponent } from "./Profiles/admin-profile/admin-profile.component";

import { EditUserModalComponent } from './Pop-up_Modals/edit-user-modal/edit-user-modal.component';
import { EditGpModalComponent } from './Pop-up_Modals/edit-gp-modal/edit-gp-modal.component';
import { AddItemModalComponent } from './Pop-up_Modals/add-item-modal/add-item-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    AllUsersComponent,
    AllGpsComponent,
    AllItemsComponent,
    ViewItemComponent,
    AdminProfileComponent,
    EditUserModalComponent,
    EditGpModalComponent,
    AddItemModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
