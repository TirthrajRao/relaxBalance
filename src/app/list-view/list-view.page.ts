import { async } from '@angular/core/testing';
import { Platform, ToastController } from '@ionic/angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import * as moment from 'moment-timezone';
import { PopoverController } from '@ionic/angular';
import { AlertPopoverComponent } from '../alert-popover/alert-popover.component';
import { Market } from '@ionic-native/market/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.page.html',
  styleUrls: ['./list-view.page.scss'],
})
export class ListViewPage implements OnInit {
  momentjs: any = moment;
  backButtonSubscription: any;
  onBoard: string;
  language: any;
  tempLang: any;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private market: Market,
    public popoverController: PopoverController,
    private fcm: FCM,
    public platform: Platform,
    public alertController: AlertController,
    public toastController: ToastController
  ) { }

  ionViewWillEnter() {
    this.onBoard = localStorage.getItem('onBoard');
    this.language = localStorage.getItem('language');
    if (!localStorage.getItem('language')) {
      // this.selectLanguage();
    }
  }

  ngOnInit() {
    this.getFcmToken();
    if (localStorage.getItem('language')) {
      this.checkForEndPeriodTrial();
      // this.setTrialStartDate();
      // this.userTrialInfoFirstTime();
      this.checkForRating();
    }
  }

  getLang(lang, e){
    this.tempLang = lang
    setTimeout(() => {
      this.language = lang
      this.translateService.use(this.language);
      localStorage.setItem('language',this.language)
      this.startApp();
    }, 500);
    console.log("LANGUAGE", lang)
  }

  async changeLanguage() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Select language',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'English',
          value: 'en',
          checked: this.language == 'en'
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'German',
          value: 'ger',
          checked: this.language == 'ger'
        },
        {
          name: 'radio1',
          type: 'radio',
          label: 'Chinese',
          value: 'chi',
          checked: this.language == 'chi'
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'French',
          value: 'fre',
          checked: this.language == 'fre'
        },
        {
          name: 'radio1',
          type: 'radio',
          label: 'Korean',
          value: 'kor',
          checked: this.language == 'kor'
        }
      ],
      buttons: [
        {
          text: 'Okay',
          handler: (e) => {
            localStorage.setItem('language',e);
            this.language = localStorage.getItem('language');
            this.translateService.use(this.language);
            alert.dismiss();
            return false
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  setTrialStartDate() {
    if (!localStorage.getItem('trialStart')) {
      let todaysDate = moment().format();
      localStorage.setItem('trialStart', todaysDate.toString());
    }
  }

  startApp() {
    localStorage.setItem('onBoard', 'true');
    this.onBoard = 'true';
    this.checkForEndPeriodTrial();
    this.setTrialStartDate();
    // this.userTrialInfoFirstTime();
    this.checkForRating();
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
    // if (noOfDaysTrial > 14) {
    // this.checkForEndPeriodTrial();
    // } else {
    this.router.navigateByUrl('/inner-page/' + type + '/' + item);
    // }
  }

  async checkForEndPeriodTrial() {
    let start = moment(localStorage.getItem('trialStart'));
    let end = moment();
    let noOfDaysTrial = end.diff(start, 'days');
    console.log(noOfDaysTrial)
    let isPurchased = localStorage.getItem('purchased');
    let text;
    // if (noOfDaysTrial > 14) {
    // if (!localStorage.getItem('purchased')) {
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
    // }
    // }
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