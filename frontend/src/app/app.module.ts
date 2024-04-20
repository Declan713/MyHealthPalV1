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

// GP Imports
import { GpProfileComponent } from './Profiles/gp-profile/gp-profile.component';
import { GpAppointmentsComponent } from './Gp-Features/gp-appointments/gp-appointments.component';


// Pop-up Modal Imports
import { EditUserModalComponent } from './Pop-up_Modals/edit-user-modal/edit-user-modal.component';
import { EditGpModalComponent } from './Pop-up_Modals/edit-gp-modal/edit-gp-modal.component';
import { AddGpModalComponent } from './Pop-up_Modals/add-gp-modal/add-gp-modal.component';
import { AddItemModalComponent } from './Pop-up_Modals/add-item-modal/add-item-modal.component';
import { PaymentModalComponent } from './Pop-up_Modals/payment-modal/payment-modal.component';
import { AddReviewModalComponent } from './Pop-up_Modals/add-review-modal/add-review-modal.component';
import { EditReviewModalComponent } from './Pop-up_Modals/edit-review-modal/edit-review-modal.component';

import { FlashMessageComponent } from './flash-message/flash-message.component';
import { FlashMessageService } from './flash-message/flash-message.service';

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
    GpProfileComponent,
    GpAppointmentsComponent,
    EditUserModalComponent,
    EditGpModalComponent,
    AddGpModalComponent,
    AddItemModalComponent,
    PaymentModalComponent,
    AddReviewModalComponent,
    EditReviewModalComponent,
    FlashMessageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
  ],
  providers: [FlashMessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
