import { async } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FCM } from '@ionic-native/fcm/ngx';
import * as moment from 'moment-timezone';
import { PopoverController } from '@ionic/angular';
import { AlertPopoverComponent } from '../alert-popover/alert-popover.component';
import { Market } from '@ionic-native/market/ngx';
import { Router } from '@angular/router';
import { noop } from '@angular/compiler/src/render3/view/util';

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
    if (!localStorage.getItem('firstDismiss')) {
      text = 'Vážená uživatelko, uživateli aplikace Psychowalkman. Jsme moc rádi, že Vám můžeme pomáhat už 14 dní. Zvažte, prosím, zda nepodpořit Vaše zdraví i naší práci předplatným. Získáte v jeho rámci možnost pokračovat v užívání Psychowalkmana a přístup k novinkám.'
    } else {
      text = 'Vážená uživatelko, uživateli aplikace PsychowalkmanJsem moc rád, že Vás zajímám. Zvolte si, prosím, formu předplatného.'
    }
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