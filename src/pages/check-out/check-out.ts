import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../providers/users/userAuth';
import { ItemService } from '../../providers/items/itemService';
import { CartService } from '../../providers/cart/cart';
import { Cart } from '../../models/cart';
import { User } from '../../models/user';
/**
 * Generated class for the CheckOutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-check-out',
  templateUrl: 'check-out.html',
})
export class CheckOutPage {
  userFG: FormGroup;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private fb: FormBuilder,
    private loading: LoadingController,
    private authService: AuthService,
    private cartService: CartService,
    private alertService: AlertController,
  ) {
    this.userFG = this.fb.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      // expDate: new FormControl('', Validators.required),
      // cvc: new FormControl('', Validators.required),
    })
  }

  makePayment() {
    const loading = this.loading.create({
      content: 'Processing your Request\nPlease Wait...',
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
      // duration: 3000,
    });
    console.log('payment done');
    loading.present();
    this.cartService.getCart(this.authService.uid)
    .subscribe((cart:Cart[]) => {
      const uids = cart.map(obj => obj.items).map(item => item.map(o => o.userUid));
      console.log(uids);
      if(uids && uids.length > 0) {
        uids[0].forEach(id => {
          return this.authService.getUsersByField('roles.provider', 100 , id)
          .subscribe((users: User[]) => {
            console.log(users);
            users.forEach(user => {
              let providerItems = cart.map(obj => obj.items).map(item => item.find(o => o.userUid === user.uid));
              if(providerItems && providerItems.length > 0) {
                this.cartService.placeOrderByCart(providerItems[0], user.uid)
                .subscribe(res => {
                  console.log(res);
                  loading.dismissAll();
                  this.cartService.deleteCart(this.authService.uid);
                  this.userFG.reset();
                  this.userFG.pristine;
                  this.userFG.untouched;
                  const alert = this.alertService.create({
                    title: 'Congratulations! Your Request has been Processed',
                    buttons:[{
                      text: 'OK',
                    },
                  {
                    text: 'More Shopping!',
                    handler:() => {
                      alert.dismiss();
                      this.navCtrl.setRoot('HomePage');
                    }
                  }]
                  });
                  alert.present();
                });
              }
            })
          });
        });
      }
    })

  }
  ionViewDidLoad() {
    this.authService.user
    .subscribe(user => {
      this.userFG.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        number: user.phoneNumber,
      })
    })
    console.log('ionViewDidLoad CheckOutPage');
  }

}
