import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import * as moment from 'moment-timezone';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
})
export class ListViewPage implements OnInit {
  momentjs: any = moment;
  constructor(public alertController: AlertController,private fcm: FCM, private platform: Platform) { }

  ngOnInit() {
    this.setTrialStartDate();
    this.getFcmToken();
    this.checkForEndPeriodTrial();
  }

  setTrialStartDate() {
    if (!localStorage.getItem('trialStart')) {
      let todaysDate = moment().format();
      console.log("ff")
      localStorage.setItem('trialStart',todaysDate.toString());
    }
  }

  getFcmToken() {
    if (!localStorage.getItem('token')) {
      this.platform.ready().then(() => {
        this.fcm.getToken().then(token => {
          localStorage.setItem('token', token)
        });
      })
    }
  }

  async checkForEndPeriodTrial() {
    let start = moment(localStorage.getItem('trialStart'));
    let end = moment();
    let noOfDaysTrial = end.diff(start, 'days');
    console.log(noOfDaysTrial)
    if(noOfDaysTrial > 14){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Alert',
        message: 'Your trial period is over!',
      });
  
      await alert.present();
    }
  }
}