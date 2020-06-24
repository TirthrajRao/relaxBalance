import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import * as moment from 'moment-timezone';
import { PopoverController } from '@ionic/angular';
import { AlertPopoverComponent } from '../alert-popover/alert-popover.component';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
})
export class ListViewPage implements OnInit {
  momentjs: any = moment;
  productIds = ['prod1', 'prod2']; // <- Add your product Ids here
  products: any;

  constructor(private iap: InAppPurchase, public popoverController: PopoverController, private fcm: FCM, private platform: Platform) { }

  ngOnInit() {
    this.setTrialStartDate();
    this.getFcmToken();
    this.checkForEndPeriodTrial();
    this.checkProducts();
  }

  checkProducts() {
    this.iap
      .getProducts(this.productIds)
      .then((products) => {
        console.log(products);
        this.products = products
        console.log("PRODUCTS", this.products)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setTrialStartDate() {
    if (!localStorage.getItem('trialStart')) {
      let todaysDate = moment().format();
      console.log("ff")
      localStorage.setItem('trialStart', todaysDate.toString());
    }
  }

  getFcmToken() {
    if (!localStorage.getItem('token')) {
      this.platform.ready().then(() => {
        if (this.platform.is('ios')) {
          const w: any = window;
          w.FCMPlugin.requestPushPermissionIOS(() => {
            console.log('push permissions success');
            this.fcm.getToken().then(token => {
              localStorage.setItem('token', token)
            });
          }, (e) => {
            console.log('push permissions fail', e);
          });
        } else {
          this.fcm.getToken().then(token => {
            localStorage.setItem('token', token)
          });
        }
      })
    }
  }

  async checkForEndPeriodTrial() {
    let start = moment(localStorage.getItem('trialStart'));
    let end = moment();
    let noOfDaysTrial = end.diff(start, 'days');
    console.log(noOfDaysTrial)
    if (noOfDaysTrial > 14) {
      const popover = await this.popoverController.create({
        component: AlertPopoverComponent,
        cssClass: 'my-custom-class',
        translucent: true,
        backdropDismiss: false
      });
      await popover.present();
    }
  }
}