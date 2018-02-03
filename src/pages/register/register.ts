import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models/user';
import { Loading } from 'ionic-angular/components/loading/loading';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  selectControl: FormControl = new FormControl('');
  public customerFG: FormGroup;
  @ViewChild(Content) content: Content;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
    this.customerFG = this.fb.group({
      companyName: new FormControl('No company', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      number: new FormControl('', [Validators.required]),
      address: new FormControl('No address', [Validators.required])
    });
  }

  ionViewDidLoad() {
    this.selectControl.valueChanges.subscribe(value => {
      this.content.scrollToTop(200);
      if(value === 'customer') {
        this.customerFG.get('')
      }
    });
  }
  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title,
      subTitle,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  login() {
    this.navCtrl.push('LoginPage');
  }
  async registerUser() {
    const env = this;
    let loading = env.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
   const email = this.customerFG.get('email').value;
    const password = this.customerFG.get('password').value;
    console.log(email, password);
    try {
    await this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((user)=>{
        console.log(user);
        this.updateUserData(user, loading);
      });
    } catch (e) {
      loading.dismissAll();
      this.presentAlert('Oops!', `${e}`);
      console.error(e);
    }
  }
  private updateUserData(user, loading: Loading) {
    console.log(user);
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      firstName: this.customerFG.get('firstName').value,
      lastName: this.customerFG.get('lastName').value,
      userName: this.customerFG.get('userName').value,
      email: user.email,
      phoneNumber: this.customerFG.get('number').value,
      companyName: this.customerFG.get('companyName').value,
      address: this.customerFG.get('address').value,
      roles: {
        customer: true?this.selectControl.value === 'customer':false,
        provider: true?this.selectControl.value === 'provider':false,
      },
    };
    return userRef.set(data, { merge: true }).then(()=>{
      this.navCtrl.setRoot('ItemListPage');
      loading.dismissAll();
    });
  }

}
