import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ItemService } from '../../providers/items/itemService';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  item: Item;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private itemService: ItemService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    this.itemService.getItem(this.navParams.get('for'), this.navParams.get('code')).subscribe(item => {
      this.item = item[0];
      console.log(this.item);
    });
  }

}
