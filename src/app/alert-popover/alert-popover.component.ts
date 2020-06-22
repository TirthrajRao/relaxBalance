import { Component, OnInit } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';

@Component({
  selector: 'app-alert-popover',
  templateUrl: './alert-popover.component.html',
  styleUrls: ['./alert-popover.component.scss'],
})
export class AlertPopoverComponent implements OnInit {
  productIds = ['prod1', 'prod2']; // <- Add your product Ids here
  products: any;

  constructor(
    private iap: InAppPurchase
  ) { }

  ngOnInit() {}

  checkProducts() {
    this.iap
      .getProducts(this.productIds)
      .then((products) => {
        console.log(products);
        this.products = products
        console.log("PRODUCTS",this.products)
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
