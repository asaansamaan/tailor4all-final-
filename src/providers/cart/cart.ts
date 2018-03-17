import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';
import { Cart } from '../../models/cart';
import { AngularFireAuth } from 'angularfire2/auth';
import { Card } from 'ionic-angular/components/card/card';
import { Loading, LoadingController } from 'ionic-angular';

@Injectable()
export class CartService {
  cartCollection: AngularFirestoreCollection<Cart>;
  cartDoc: AngularFirestoreDocument<Cart>;

  constructor(public afs: AngularFirestore, private auth: AngularFireAuth, private loading: LoadingController ) {
    this.cartCollection = this.afs.collection('user-cart', ref => ref);
    
  }

  getCart(userUid) {
   const collection = this.afs.collection('user-cart', ref => 
    ref.where('userUid', '==', userUid )
    .limit(1));
    // collection.doc('userUid').update({})
    return collection.snapshotChanges().map(changes => {
      return changes.map(a=>{
        return a.payload.doc.data() as Cart;
      })
    })
  }
  addCart(userUid, items: Item[]) {
    const cart = {
      userUid: this.auth.auth.currentUser.uid,
      items,
    }
    this.getCart(userUid)
    .filter((cart:Cart[]) => cart && cart.length === 0)
    .subscribe(()=>{
      this.cartCollection.add(cart)
      .then((value) => {
        console.log(value);
        return;
      }).catch((err) => {
        window.alert('You Dont have permission to Add Item');
        console.log(err);
        return;
      });
    });
    this.updateCart(userUid, items);
  }

  deleteCart(userUid: string) {
    this.cartDoc = this.afs.doc(`user-cart/${userUid}`);
    this.cartDoc.delete();
  } 
  updateCart(userUid: string, items) {
    console.log(userUid, items);
    const loading = this.loading.create({
      content: 'Adding To Cart',
      dismissOnPageChange: true,
      enableBackdropDismiss: true,
    });
    loading.present();
    const ref: AngularFirestoreDocument<any> = this.afs.doc(`user-cart/${userUid}`);
    return ref.set({
      userUid,
      items: items,
    }).then(() => {
      loading.dismissAll();
      console.log('updated')
    });
    // this.cartDoc.update({userUid, items});
  }
}
