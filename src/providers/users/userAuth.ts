import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'
import { User } from '../../models/user';
@Injectable()
export class AuthService {
  user: Observable<User>;
  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
            ) {
      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
            console.log(user);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      });
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }
  loginWithEmail(email, password) {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }
  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }
  public updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = user;
    return userRef.set(data);
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
        // this.navCtrl.setRoot('HomePage');
    });
  }
}