import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list-view',
    pathMatch: 'full'
  },
  {
    path: 'list-view',
    loadChildren: () => import('./list-view/list-view.module').then( m => m.ListViewPageModule)
  },
  {
    path: 'inner-page/:type/:name',
    loadChildren: () => import('./inner-page/inner-page.module').then( m => m.InnerPagePageModule)
  },
  {
    path: 'product-info',
    loadChildren: () => import('./product-info/product-info.module').then( m => m.ProductInfoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
