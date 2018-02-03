import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private afAuth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }
  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title,
      subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  async login(user) {
    const env = this;
    const loading = env.loadingCtrl.create({
      content: 'Logging In!\n Have Patience :)',
      enableBackdropDismiss: false,
    });
    loading.present();
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        this.navCtrl.setRoot('ItemListPage');
        loading.dismissAll();
      }  
    }
    catch (e) {
      console.error(e);
      loading.dismissAll();
      this.presentAlert('We are unable to Login to you :(', `${e}`);
    }
  }
 register() {
   this.navCtrl.push('RegisterPage');
 }
  
}