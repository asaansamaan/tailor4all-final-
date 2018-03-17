import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowItemsPage } from './show-items';
import { ItemService } from '../../providers/items/itemService';
import { CartService } from '../../providers/cart/cart';

@NgModule({
  declarations: [
    ShowItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowItemsPage),
  ],
  providers:[
    ItemService, CartService
  ]
})
export class ShowItemsPageModule {}
