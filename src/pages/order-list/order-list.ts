import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderService } from '../../providers/orders/orders';
import { AuthService } from '../../providers/users/userAuth';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';

/**
 * Generated class for the OrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {
  orders: Observable<Item[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private orderService: OrderService, private auth: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderListPage');
    this.orders = this.orderService.getOrder(this.auth.uid);
  }

}
