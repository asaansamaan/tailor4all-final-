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
  public get uid () {
    return this.afAuth.auth.currentUser.uid ;
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
    console.log('user in service', user);
    const data: User = user;
    return userRef.set(data);
  }
  public updateUserDp(id, photoUrl) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${id}`);
    return userRef.set({
      photoURL: photoUrl,
    });
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
        // this.navCtrl.setRoot('HomePage');
    });
  }
  public getUsers(type,limit, orderBy) {
    const collection = this.afs.collection('users', ref => 
      ref.limit(limit)
    );
    return collection.snapshotChanges().map(changes => {
      return changes.map(a=>{
        return a.payload.doc.data() as User;
      })
    });
  }
  public getUsersByField(type,limit, field) {
    const collection = this.afs.collection('users', ref => 
      ref
      .limit(limit)
      .where('uid', '==', field)
    );
    return collection.snapshotChanges().map(changes => {
      return changes.map(a=>{
        return a.payload.doc.data() as User;
      })
    });
  }
}