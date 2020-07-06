import { Platform } from '@ionic/angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import * as moment from 'moment-timezone';
import { PopoverController } from '@ionic/angular';
import { AlertPopoverComponent } from '../alert-popover/alert-popover.component';
import { Market } from '@ionic-native/market/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
})
export class ListViewPage implements OnInit {
  momentjs: any = moment;
  backButtonSubscription: any;

  constructor(
    private router: Router,
    private market: Market,
    public popoverController: PopoverController,
    private fcm: FCM,
    public platform: Platform,
  ) { }

  ionViewDidEnter() {
  }

  ngOnInit() {
    this.setTrialStartDate();
    this.getFcmToken();
    this.checkForEndPeriodTrial();
    this.userTrialInfoFirstTime();
    this.checkForRating();
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

  singleItem(type, item) {
    let start = moment(localStorage.getItem('trialStart'));
    let end = moment();
    let noOfDaysTrial = end.diff(start, 'days');
    if (noOfDaysTrial > 14) {
      this.checkForEndPeriodTrial();
    } else {
      this.router.navigateByUrl('/inner-page/' + type + '/' + item);
    }
  }

  async checkForEndPeriodTrial() {
    let start = moment(localStorage.getItem('trialStart'));
    let end = moment();
    let noOfDaysTrial = end.diff(start, 'days');
    console.log(noOfDaysTrial)
    let text;
    text = '싸이코워크맨 사용자 여러분, 14일 동안 도와드릴 수 있게 되어 기쁩니다. 저희 플랜 중 하나를 구독해 보시기 바랍니다. 전체 내용을 유지하고 새로운 기능에 액세스 할 수 있게 됩니다.'
    if (noOfDaysTrial > 14) {
      const popoverTrialEnd = await this.popoverController.create({
        componentProps: {
          'type': 'subscribeConfirm',
          'text': text
        },
        component: AlertPopoverComponent,
        cssClass: 'my-custom-class',
        translucent: true,
        backdropDismiss: false
      });
      await popoverTrialEnd.present();

      popoverTrialEnd.onDidDismiss().then(async (res: any) => {
        if (res.data == 'true') {
          const popoverSubscribe = await this.popoverController.create({
            componentProps: {
              'type': 'subscriptionType'
            },
            component: AlertPopoverComponent,
            cssClass: 'my-custom-class',
            translucent: true,
            backdropDismiss: false
          });
          await popoverSubscribe.present();
          popoverSubscribe.onDidDismiss().then(async (res: any) => {
            if (!localStorage.getItem('firstDismiss')) {
              localStorage.setItem('firstDismiss', 'true')
            }
          })
        }
        localStorage.setItem('firstDismiss', 'true')
      })
    }
  }

  async userTrialInfoFirstTime() {
    if (!localStorage.getItem('trialInfo')) {
      const popover = await this.popoverController.create({
        componentProps: {
          'type': 'trialInfo'
        },
        component: AlertPopoverComponent,
        cssClass: 'my-custom-class',
        translucent: true,
        backdropDismiss: false
      });
      await popover.present();

      popover.onDidDismiss().then((type: any) => {
        console.log("dismiss", type)
        if (!localStorage.getItem('trialInfo')) {
          localStorage.setItem('trialInfo', 'true');
        }
      })
    }
  }

  async checkForRating() {
    if (localStorage.getItem('ratingCounter')) {
      if (localStorage.getItem('ratingCounter') == '1') {
        localStorage.setItem('ratingCounter', '2')
      } else if (localStorage.getItem('ratingCounter') == '2') {
        localStorage.setItem('ratingCounter', '3')
      } else if (localStorage.getItem('ratingCounter') == '3') {
        const popoverRating = await this.popoverController.create({
          componentProps: {
            'type': 'rating'
          },
          component: AlertPopoverComponent,
          cssClass: 'my-custom-class',
          translucent: true,
          backdropDismiss: false
        });
        await popoverRating.present();

        popoverRating.onDidDismiss().then((res: any) => {
          if (res.data == 'true') {
            console.log("rating", res);
            this.market.open('io.ionic.psychowalkman');
            localStorage.setItem('ratingCounter', '4')
          }
          localStorage.setItem('ratingCounter', '1')
        })
      }
    } else {
      localStorage.setItem('ratingCounter', '1')
    }
  }
}