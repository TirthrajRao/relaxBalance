import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.setTrialStartDate();
      this.splashScreen.hide();
    });
  }

  setTrialStartDate() {
    if (!localStorage.getItem('trialStart')) {
      let todaysDate = new Date();
      console.log("ff")
      localStorage.setItem('trialStart',todaysDate.toString());
      // const timeDiff =  +(new Date()) - +(new Date(localStorage.getItem('trialStart')));
      // const days = timeDiff / (1000 * 60 * 60 * 24)
      // console.log(days.toFixed(0))
    }
  }
}
