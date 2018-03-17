import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../providers/users/userAuth';
import { User } from '../../models/user';

/**
 * Generated class for the ContactUsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {
  user: User;
  contactFG: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private fb: FormBuilder,
    private authService: AuthService,
   ) {
     this.authService.user.subscribe((user: User) => {
       this.user = user;
      });
      this.contactFG = this.createForm(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }
  private createForm(user) {
    return  this.fb.group({
      firstName: new FormControl(this.user && this.user.firstName || '',[Validators.required]),
      email: new FormControl(this.user && this.user.email || '',[Validators.required]),
      phone: new FormControl(this.user && this.user.phoneNumber || '',[Validators.required]),
      message: new FormControl('',[Validators.required]),
    });
  }
}
