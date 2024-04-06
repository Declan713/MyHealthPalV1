import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminFeaturesComponent } from './admin-features/admin-features.component';
import { AllUsersComponent } from './all-users/all-users.component'; 
import { AllGpsComponent } from './all-gps/all-gps.component';

import { EditUserModalComponent } from './edit-user-modal/edit-user-modal.component';
import { EditGpModalComponent } from './edit-gp-modal/edit-gp-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    AdminFeaturesComponent,
    AllUsersComponent,
    AllGpsComponent,
    EditUserModalComponent,
    EditGpModalComponent,
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
