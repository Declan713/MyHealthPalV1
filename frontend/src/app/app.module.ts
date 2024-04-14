import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';

// Admin Imports
import { AdminProfileComponent } from "./Profiles/admin-profile/admin-profile.component";
import { AllUsersComponent } from './Admin-Features/all-users/all-users.component'; 
import { AllGpsComponent } from './Admin-Features/all-gps/all-gps.component';
import { AllItemsComponent } from './Admin-Features/all-items/all-items.component';
import { ViewItemComponent } from './Admin-Features/view-item/view-item.component';


// User Imports
import { UserProfileComponent } from './Profiles/user-profile/user-profile.component';
import { AllUserItemsComponent } from './User-Features/all-user-items/all-user-items.component';
import { ItemComponent } from './User-Features/item/item.component';
import { UserAppointmentsComponent } from './User-Features/user-appointments/user-appointments.component';
import { UserBasketComponent } from './User-Features/user-basket/user-basket.component';
import { UserBookingComponent } from './User-Features/user-booking/user-booking.component';


// Pop-up Modal Imports
import { EditUserModalComponent } from './Pop-up_Modals/edit-user-modal/edit-user-modal.component';
import { EditGpModalComponent } from './Pop-up_Modals/edit-gp-modal/edit-gp-modal.component';
import { AddItemModalComponent } from './Pop-up_Modals/add-item-modal/add-item-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    AdminProfileComponent,
    AllUsersComponent,
    AllGpsComponent,
    AllItemsComponent,
    ViewItemComponent,
    UserProfileComponent,
    AllUserItemsComponent,
    ItemComponent,
    UserAppointmentsComponent,
    UserBasketComponent,
    UserBookingComponent,
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
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
