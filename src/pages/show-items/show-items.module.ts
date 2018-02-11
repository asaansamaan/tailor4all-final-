import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowItemsPage } from './show-items';
import { ItemService } from '../../providers/items/itemService';

@NgModule({
  declarations: [
    ShowItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowItemsPage),
  ],
  providers:[
    ItemService,
  ]
})
export class ShowItemsPageModule {}
