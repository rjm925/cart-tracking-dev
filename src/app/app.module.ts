import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddCartComponent } from './components/add-cart/add-cart.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CartsComponent } from './components/carts/carts.component';
import { HistoryComponent } from './components/history/history.component';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProcessorsComponent } from './components/processors/processors.component';
import { ProcessorCartsComponent } from './components/processor-carts/processor-carts.component';
import { TestPageComponent } from './components/test-page/test-page.component';

import { CartService } from './services/cart.service';
import { EmployeeService } from './services/employee.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    AddCartComponent,
    NotFoundComponent,
    CartsComponent,
    HistoryComponent,
    LoginComponent,
    SettingsComponent,
    TestPageComponent,
    ProcessorsComponent,
    ProcessorCartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'cart-tracking'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [
    CartService,
    EmployeeService, 
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
