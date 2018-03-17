import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/users/userAuth';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';

/**
 * Generated class for the SplistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-splist',
  templateUrl: 'splist.html',
})
export class SplistPage {
  showAddress: boolean[] = [];
  validTailors: User[] = [];
  showPhone: boolean[] = [];
  tailors: Observable<User[]>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
   this.tailors = this.authService.getUsers('roles.provider', 10, 'name');
    this.tailors.subscribe((tailors: User[]) => {
      console.log(tailors);
      tailors.forEach(tailor => {
        if(tailor.roles && tailor.roles.provider) {
          this.validTailors.push(tailor);
        }
      });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplistPage');
  }
  hire() {
    this.presentAlert('Feature Coming Soon!', 'Stay Tunned!!!')
  }
 showDetails(type, index) {
   let loading = this.loadingCtrl.create({
     content: 'Getting Data! Please wait...'
   });
   if(type === 'phone') {
     if(this.showPhone[index]) {
       return;
      }
      loading.present();
     setTimeout(() => {
       this.showPhone[index] = true;
       loading.dismissAll();
     }, 2000);
     return;
    }
    if(this.showAddress[index]) {
      return;
    }
    loading.present();
   setTimeout(() => {
     this.showAddress[index] = true;
     loading.dismissAll();
   }, 2000);
  
  }
  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title,
      subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
