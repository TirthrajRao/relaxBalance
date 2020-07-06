import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InnerPagePageRoutingModule } from './inner-page-routing.module';

import { InnerPagePage } from './inner-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InnerPagePageRoutingModule
  ],
  declarations: [InnerPagePage]
})
export class InnerPagePageModule {}
