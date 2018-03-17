import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../providers/users/userAuth';
import { ItemService } from '../../providers/items/itemService';
import { CartService } from '../../providers/cart/cart';
import { Cart } from '../../models/cart';

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
    .map((cart:Cart[]) => {
      const uids = cart.map(obj => obj.items).map(item => item.map(o => o.userUid));
      console.log(uids);
      uids[0].forEach(id => {
        return this.authService.getUsersByField('roles.provider', 100 , id)
        .subscribe(user => console.log(user))
      });
    }).subscribe(user => {
      loading.dismissAll();
      console.log(user)
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
    });

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
