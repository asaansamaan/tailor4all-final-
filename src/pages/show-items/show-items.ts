import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ItemService } from '../../providers/items/itemService';
import { Item } from '../../models/item';
import { CartService } from '../../providers/cart/cart';
import { AuthService } from '../../providers/users/userAuth';
import { User } from '../../models/user';
/**
 * Generated class for the ShowItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-items',
  templateUrl: 'show-items.html',
})
export class ShowItemsPage {
  removed: [boolean] = [false];
  currentUser: User;
  items: Observable<Item[]>;
  femaleItems: any = [];
  category: string;
  cartItems: Item[] = [];

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private http: Http,
     private itemService: ItemService,
     private cartService: CartService,
     private authService: AuthService, 
    ) {
      this.authService.user
      .subscribe(user => this.currentUser);
  }
  
  ionViewDidLoad() {
    const category = this.navParams.get('category');
    this.category = category;
    if(category === 'men') {
      this.items = this.itemService.categorizedItems('male', 10, 'name')
      this.items.subscribe(items => {
        console.log(items);
      })
    }
    if(category === 'women') {
     this.items = this.itemService.categorizedItems('female', 10, 'name')
    }
  }
  goToPaymentPage(item: Item) {
    this.navCtrl.push('PaymentPage', {code: item.code, for:item.for})
  }
  addToCart(item: Item, index) {
    this.removed[index] = true;
    this.cartItems.push(item);
    this.cartService.addCart(this.authService.uid, this.cartItems);
  }
  removeFromCart(item: Item, index) {
    this.removed[index] = false;
    this.cartItems.splice(index, 1);
    this.cartService.updateCart(this.authService.uid, this.cartItems);
  }
}
