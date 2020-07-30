import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FCM } from '@ionic-native/fcm/ngx';
// import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { CommonModule } from '@angular/common';
import {AlertPopoverComponent} from './alert-popover/alert-popover.component'
import { Market } from '@ionic-native/market/ngx';

@NgModule({
  declarations: [AppComponent,AlertPopoverComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,CommonModule],
  providers: [
    StatusBar,
    SplashScreen,
    // InAppPurchase2,
    Market,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
