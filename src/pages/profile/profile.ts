import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import { AuthService } from '../../providers/users/userAuth';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  hideCamera: boolean;
  userImageUrl: any;
  userId: string;
  userFG: FormGroup;
  captureDataUrl: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private camera: Camera,
    private authService: AuthService,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
  ) {
    this.authService.user
    .subscribe(user => {
      console.log(user);
      this.user = user;
      this.userFG = this.createUserFG(user);
      this.userId = user.uid;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  
capture() {
  this.hideCamera = true;
    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    };

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      this.hideCamera = false;
    }, (err) => {
      // Handle error
    });
  }
  upload() {
    const env = this;
    const loading = env.loadingCtrl.create({
      content: 'Uploading Profile Picture :)',
      enableBackdropDismiss: false,
    });
    loading.present(); 
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = this.userId;

    // Create a reference to 'images/todays-date.jpg'
    const imageRef = storageRef.child(`images/usersDp/${filename}.jpg`);
    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL).then((snapshot)=> {
      // Do something here when the data is succesfully uploaded!
      this.userImageUrl = snapshot.downloadURL;
      loading.dismissAll();
     }).catch(err=> {
       console.log(err);
       loading.dismissAll();
       this.camera.cleanup();
    });
  }
   updateProfile() {
    const env = this;
    const loading = env.loadingCtrl.create({
      content: 'Updating user\n Have Patience :)',
      enableBackdropDismiss: false,
    });
    loading.present(); 
    let userObj = this.userFG.value;
    userObj = this.transformUser(userObj);
    if(this.captureDataUrl) {
      userObj =Object.assign(userObj, {
         photoURL: this.userImageUrl
       });
      }
     this.authService.updateUserData(userObj).then(updatedUser => {
      loading.dismissAll();
      console.log(updatedUser);
     })
     .catch(e => {
       loading.dismissAll();
       console.log(e);
     });
   }
   private createUserFG(user: User) {
    return this.fb.group({
      uid: user.uid,
      firstName: new FormControl(user && user.firstName || '', [Validators.required]),
      lastName: new FormControl(user && user.lastName || '', [Validators.required]),
      dob: new FormControl(user && user.dob || '', [Validators.required]),
      gender: new FormControl(user && user.gender || '', [Validators.required]),
      shoulders: new FormControl(user && user.measurements && user && user.measurements.shoulders || '', [Validators.required]),
      chest: new FormControl(user && user.measurements && user && user.measurements.chest || '', [Validators.required]),
      collarSize: new FormControl(user && user.measurements && user && user.measurements.collarSize || '', [Validators.required]),
      sleevesSize: new FormControl(user && user.measurements && user && user.measurements.sleevesSize || '', [Validators.required]),
      shirtSize: new FormControl(user && user.measurements && user && user.measurements.shirtSize || ''),
    });
   }
   private transformUser(user) {
    user = Object.assign(user, {
      measurements: {
        shoulders: user.shoulders,
        chest: user.chest,
        collarSize: user.collarSize,
        sleevesSize: user.sleevesSize,
        shirtSize: user.shirtSize,
      }
    });
    delete user.shoulders;
    delete user.chest;
    delete user.collarSize;
    delete user.sleevesSize;
    delete user.shirtSize;
    return user;
   }
}
