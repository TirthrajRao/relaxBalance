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
  product: IAPProduct;
  productId : any;
  modalType: any;
  text: any;
  deviceType: string;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public popover: PopoverController,
    public platform: Platform,
    private iap2: InAppPurchase2,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.setProductIds();
    console.log(this.productId)
    this.platform.ready().then(async () => {
      this.setup();
    });
    this.modalType = this.navParams.data.type;
    this.text = this.navParams.data.text;
    console.log(this.modalType);
    if(this.platform.is('ios')){
      this.deviceType = 'ios'
    }else{
      this.deviceType = 'android'
    }
  }

  setProductIds(){
    if(this.platform.is('ios')){
      this.productId = [{
        id: 'kcmesicne_ios',
        type: this.iap2.PAID_SUBSCRIPTION
      }, {
        id: 'kcrocne1_ios',
        type: this.iap2.PAID_SUBSCRIPTION
      }, {
        id: 'kcpropredplatitelebalance_ios',
        type: this.iap2.PAID_SUBSCRIPTION
      }
      ]
    }else{
      this.productId = [{
        id: 'kcmesicne',
        type: this.iap2.PAID_SUBSCRIPTION
      }, {
        id: 'kcrocne1',
        type: this.iap2.PAID_SUBSCRIPTION
      }, {
        id: 'kcpropredplatitelebalance',
        type: this.iap2.PAID_SUBSCRIPTION
      }
      ]
    }
  }
  setup() {
    this.iap2.register(this.productId);
    this.iap2.refresh();
    setTimeout(() => {
      console.log(new Date(JSON.parse(this.iap2.get(this.productId[1].id).transaction.receipt).purchaseTime))
    }, 3000);
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
      // alert('approved');
      product.finish();
    });
    this.iap2.when(productId).refunded((product: IAPProduct) => {
      // alert('refunded');
    });
    this.iap2.when(productId).expired((product: IAPProduct) => {
      // alert('expired');
    });
  }

  checkout(productId) {
    // this.registerHandlersForPurchase(productId);
    try {
      let product = this.iap2.get(productId);
      console.log('Product Info: ', product);
      this.iap2.order(productId).then((p) => {
        this.iap2.when(productId).owned((product: IAPProduct) => {
          console.log(` owned ${product.owned}`);
          console.log(p);
          product.finish();
        });
        // alert('Purchase Succesful' + JSON.stringify(p));
      }).catch((e) => {
        alert('Error Ordering From Store' + e);
      });
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }

  async cancel() {
    const toast = await this.toastController.create({
      message: 'Vaše zkušební doba skončila!',
      duration: 2000
    });
    toast.present();
    this.popover.dismiss();
  }

  dismiss(trialInfo) {
    this.popover.dismiss(trialInfo);
  }

  restoreExistingSubsription(){
    
  }

  async discountedCheckout(productId) {
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'discountCode',
          type: 'password',
          placeholder: 'prosíme, vložte zde heslo '
        }],
      buttons: [
        {
          text: 'zrušení',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Souhlasím',
          handler: async (alertData) => {
            if(alertData.discountCode == 'BALANCE'){
              this.checkout(productId);
            }else{
              const toast = await this.toastController.create({
                message: 'zadejte správné heslo',
                position: 'bottom',
                duration: 3000
              });
              toast.present();
            }     
          }
        }
      ]
    });
    await alert.present();
  }
}

