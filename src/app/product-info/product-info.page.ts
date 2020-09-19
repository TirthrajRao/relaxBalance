import { Component, OnInit } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx';
import { Platform, ToastController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as _ from 'lodash'

const MONTHLYLVL_KEY = 'mindmachine';
const YEARLY_KEY = 'mindmachineyearly';
const MONTHLYBENIFIT_KEY = 'mindmachinebalance';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.page.html',
  styleUrls: ['./product-info.page.scss'],
})
export class ProductInfoPage implements OnInit {
  // public products: "IAPProduct";
  // // productId = ['mindmachine', 'mindmachineyearly', 'mindmachinebalance']
  // productId = [
  //   {
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
  // public allProducts: Array<any> = [];
  // public isPurchased: boolean = false;
  passPlaceholder: any;
  buttonCancel: any;
  buttonIAgree: any;
  // constructor(private iap2: InAppPurchase2, 
  //   public platform: Platform, 
  //   private translate: TranslateService,
  //   public alertController: AlertController, 
  //   public toastController: ToastController) { }



  // ngOnInit() {
  //   this.iap2.validator = "https://billing.fovea.cc/";
  //   this.platform.ready().then(async () => {
  //     this.displayProducts();
  //   });
  // }



  // async ionViewDidEnter() {

  // }

  // async displayProducts () {
  //   this.productId.forEach((product)=>{
  //     console.log("product id", product.id)
  //     let store_product = this.iap2.get(product.id);
  //     this.allProducts.push(store_product);
  //   })
  //   // this.iap2.refresh();
  //   console.log("====>>>>>",this.allProducts)
  // }

  // async setup() {    
  //     this.iap2.register(this.productId);
  //     this.registerHandlersForPurchase(this.productId);
  //     this.iap2.refresh();  
  // }

  // registerHandlersForPurchase(productId) {
  //   let self = this.iap2;
  //   this.iap2.when(productId).updated(function (product) {
  //     if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
  //       product.finish();
  //     }
  //   });
  //   this.iap2.when(productId).registered((product: IAPProduct) => {
  //     // alert(` owned ${product.owned}`);
  //   });
  //   this.iap2.when(productId).owned((product: IAPProduct) => {
  //     // alert(` owned ${product.owned}`);
  //     product.finish();
  //   });
  //   this.iap2.when(productId).approved((product: IAPProduct) => {
  //     product.verify();
  //     product.finish();
  //     this.displayProducts();
  //   });
  //   this.iap2.when(productId).refunded((product: IAPProduct) => {
  //     // alert('refunded');
  //   });
  //   this.iap2.when(productId).expired((product: IAPProduct) => {
  //     // alert('expired');
  //   });
  // }

  // async restorePurchase() {
  //   this.setup();
  // }

  // async discountedCheckout(productId) {
  //   this.translate.get(["passPlaceholder", "buttonCancel", "buttonIAgree"]).subscribe(async (mes: any) => {
  //     this.passPlaceholder = mes.passPlaceholder;
  //     this.buttonCancel = mes.buttonCancel;
  //     this.buttonIAgree = mes.buttonIAgree;
  //   })
  //   const alert = await this.alertController.create({
  //     inputs: [
  //       {
  //         name: 'discountCode',
  //         type: 'password',
  //         placeholder: this.passPlaceholder
  //       }],
  //     buttons: [
  //       {
  //         text: this.buttonCancel,
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: this.buttonIAgree,
  //         handler: async (alertData) => {
  //           if (alertData.discountCode == 'BALANCE') {
  //             this.buyProduct(productId);
  //           } else {
  //             this.translate.get("incorrectPassToast").subscribe(async (mes: any) => {
  //               const toast = await this.toastController.create({
  //                 message: mes,
  //                 duration: 2000
  //               });
  //               toast.present();
  //             })
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // buyProduct = async(p_id) => {
  //   console.log("in buy product...",p_id);
  //   await this.setup()
  //  try {
  //     this.iap2.order(p_id).then(async (p) => {
  //       console.log('Purchase Succesful' + JSON.stringify(p));
  //       this.iap2.refresh();   
  //     }).catch((e) => {
  //       console.log('Error Ordering From Store' + e);
  //     });
  //   }  catch (err) {
  //     console.log('Something went wrong... ' + JSON.stringify(err));
  //   }
  // }

  
  products = [];
  previousPurchases = [];
  yearlySub = false;
  monthlySub = false;

  constructor(private iap: InAppPurchase, private plt: Platform,
    private translate: TranslateService,
    public alertController: AlertController,
    public toastController: ToastController,
    private iab: InAppBrowser) {
    this.plt.ready().then(() => {
      this.iap.getProducts([MONTHLYLVL_KEY, YEARLY_KEY, MONTHLYBENIFIT_KEY])
        .then((products) => {
          console.log(products);
          this.products = products;
        })
        .catch((err) => {
          console.log(err);
        });
    })
  }

  ngOnInit() {

  }

  async buyProduct(product) {
    if (product === MONTHLYBENIFIT_KEY) {
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
                this.iap.buy(product).then(data => {
                  this.enableItems(product);
                })
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
    } else {
      this.iap.buy(product).then(data => {
        this.enableItems(product);
      })
    }
  }

  restore() {
    this.iap.restorePurchases().then(purchases => {
      this.previousPurchases = purchases;
      console.log(this.previousPurchases);
      // Unlock the features of the purchases!
      for (let prev of this.previousPurchases) {
        this.enableItems(prev.productId)
      }
    });
  }

  enableItems(id) {
    // Normally store these settings/purchases inside your app or server!
    if (id === YEARLY_KEY) {
      this.yearlySub = true;
    } else if (id === MONTHLYBENIFIT_KEY) {
      this.monthlySub = true;
    } else if (id === MONTHLYLVL_KEY) {
      this.monthlySub = true;
    }
  }

  async openPolicy() {
    const browser = this.iab.create(`https://www.balanceapp.org/zasady-ochrany-osobnich-udaju/`)
    browser.show();
  }
}
