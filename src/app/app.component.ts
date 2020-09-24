import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { InAppPurchase2, IAPProduct} from '@ionic-native/in-app-purchase-2/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  // productId = [{
  //   id: 'mindmachine',
  //   type: this.iap2.PAID_SUBSCRIPTION
  // }, {
  //   id: 'mindmachineyearly',
  //   type: this.iap2.PAID_SUBSCRIPTION
  // }, {
  //   id: 'mindmachinebalance',
  //   type: this.iap2.PAID_SUBSCRIPTION
  // }
  // ]
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private iap2: InAppPurchase2
  ) {
    this.initializeApp();
  }

  registerHandlersForPurchase(productId) {
    let self = this.iap2;
    this.iap2.when(productId).updated(function (product) {
      if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
        product.finish();
      }
    });
    this.iap2.when(productId).registered((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
    });
    this.iap2.when(productId).owned((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      product.finish();
    });
    this.iap2.when(productId).approved((product: IAPProduct) => {
      product.finish();
    });
    this.iap2.when(productId).refunded((product: IAPProduct) => {
      // alert('refunded');
    });
    this.iap2.when(productId).expired((product: IAPProduct) => {
      // alert('expired');
    });
  }


   initializeApp() {
    this.platform.ready().then(async () => {
      this.translate.setDefaultLang('fre');
      localStorage.setItem('language', 'fre');
      this.statusBar.backgroundColorByHexString('#000000');
      this.splashScreen.hide();
      // await this.iap2.register(this.productId);
      // // await this.registerHandlersForPurchase(this.productId);
      // await this.iap2.refresh();
    });
  }
}
