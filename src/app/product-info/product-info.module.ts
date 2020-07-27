import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductInfoPageRoutingModule } from './product-info-routing.module';

import { ProductInfoPage } from './product-info.page';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ProductInfoPageRoutingModule
  ],
  declarations: [ProductInfoPage]
})
export class ProductInfoPageModule {}
