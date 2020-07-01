import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InnerPagePage } from './inner-page.page';

const routes: Routes = [
  {
    path: '',
    component: InnerPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InnerPagePageRoutingModule {}
