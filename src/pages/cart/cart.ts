import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartService } from '../../providers/cart/cart';
import { Item } from '../../models/item';
import { AuthService } from '../../providers/users/userAuth';
import { User } from '../../models/user';
import { Cart } from '../../models/cart';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  currentUser: User;
  cartItems:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private cartService: CartService, private authService: AuthService) {
    this.authService.user
    .switchMap(user => {
      this.currentUser = user;
      return this.cartService.getCart(user.uid || this.authService.uid)
    })
    .subscribe((items: Cart[]) => {
      if(items && items.length > 0) {
        const cart = items.map((obj:Cart) => obj.items)[0]
        this.cartItems = Object.assign(cart);
        console.log(this.cartItems);
      }
    });
  }
  removeFromCart(item: Item, index) {
    this.cartItems.splice(index, 1);
    console.log(this.cartItems);
    this.cartService.updateCart(this.authService.uid, this.cartItems);
  }
  proceedToCheckOut() {
    this.navCtrl.push('CheckOutPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }
  

}
