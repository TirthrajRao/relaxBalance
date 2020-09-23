import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform, NavParams } from '@ionic/angular';
import { ToastController, PopoverController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alert-popover',
  templateUrl: './alert-popover.component.html',
  styleUrls: ['./alert-popover.component.scss'],
})
export class AlertPopoverComponent implements OnInit {
  // product: IAPProduct;
  productId = [{
    id: 'mindmachine',
    type: this.iap2.PAID_SUBSCRIPTION
  }, {
    id: 'mindmachineyearly',
    type: this.iap2.PAID_SUBSCRIPTION
  }, {
    id: 'mindmachinebalance',
    type: this.iap2.PAID_SUBSCRIPTION
  }
  ]
  modalType: any;
  text: any;
  passPlaceholder: any;
  buttonCancel: any;
  buttonIAgree: any;
  product:any;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public popover: PopoverController,
    public platform: Platform,
    private iap2: InAppPurchase2,
    private navParams: NavParams,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.modalType = this.navParams.data.type;
    this.text = this.navParams.data.text;
    console.log(this.modalType);
  }
  
  ionViewDidEnter() {
    this.platform.ready().then(async () => {
      // this.setup();
    });
  }

  async setup() {
    this.iap2.verbosity = this.iap2.DEBUG;
    await this.iap2.register(this.productId);
    // console.log('product 1 ' + JSON.stringify(this.product));
    // this.registerHandlersForPurchase('ionic_101');
    // restore purchase
    await this.iap2.refresh();
  }

  registerHandlersForPurchase(productId) {
    let self = this.iap2;
    this.iap2.when(productId).updated(function (product) {
      console.log('updated: ' + JSON.stringify(product));
      if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
        product.finish();
      }
    });

    this.iap2.when(productId).registered((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      console.log('registered: ' + JSON.stringify(product));
    });

    this.iap2.when(productId).owned((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      console.log('owned: ' + JSON.stringify(product));
      product.finish();
    });

    this.iap2.when(productId).approved((product: IAPProduct) => {
      // alert('approved');
      console.log('approved: ' + JSON.stringify(product));
      product.finish();
    });

    this.iap2.when(productId).refunded((product: IAPProduct) => {
      // alert('refunded');
      console.log('refunded: ' + JSON.stringify(product));
    });

    this.iap2.when(productId).expired((product: IAPProduct) => {
      // alert('expired');
      console.log('expired: ' + JSON.stringify(product));
    });
  }

  async checkout(productId) {
    await this.registerHandlersForPurchase(productId);
    try {
      this.product = this.iap2.get(productId);
      console.log('product 1 ' + JSON.stringify(this.product))
      this.iap2.order(productId).then((p) => {
        console.log('Purchase Succesful' + JSON.stringify(p));
      }).catch((e) => {
        console.log('Error Ordering From Store' + e);
      });
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }

  async cancel() {
    this.translate.get("trialPeriodToast").subscribe(async (mes: any) => {
      const toast = await this.toastController.create({
        message: mes,
        duration: 2000
      });
      toast.present();
    })
    this.popover.dismiss();
  }

  dismiss(trialInfo) {
    this.popover.dismiss(trialInfo);
  }

  restoreExistingSubsription() {

  }

  async discountedCheckout(productId) {
    this.translate.get(["passPlaceholder", "buttonCancel", "buttonIAgree"]).subscribe(async (mes: any) => {
      this.passPlaceholder = mes.passPlaceholder;
      this.buttonCancel = mes.buttonCancel;
      this.buttonIAgree = mes.buttonIAgree;
    })
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'discountCode',
          type: 'password',
          placeholder: this.passPlaceholder
        }],
      buttons: [
        {
          text: this.buttonCancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.buttonIAgree,
          handler: async (alertData) => {
            if (alertData.discountCode == 'BALANCE') {
              this.checkout(productId);
            } else {
              this.translate.get("incorrectPassToast").subscribe(async (mes: any) => {
                const toast = await this.toastController.create({
                  message: mes,
                  duration: 2000
                });
                toast.present();
              })
            }
          }
        }
      ]
    });
    await alert.present();
  }
}

