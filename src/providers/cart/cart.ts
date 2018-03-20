import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';
import { Cart } from '../../models/cart';
import { AngularFireAuth } from 'angularfire2/auth';
import { Card } from 'ionic-angular/components/card/card';
import { Loading, LoadingController } from 'ionic-angular';
import { Subscriber } from 'rxjs/Subscriber';
import { AuthService } from '../users/userAuth';
import { User } from '../../models/user';
import { OrderService } from '../orders/orders';
import { Tabs } from 'ionic-angular/components/tabs/tabs';
import { TABS } from 'ionic-angular/navigation/nav-util';

@Injectable()
export class CartService {
  cartCollection: AngularFirestoreCollection<Cart>;
  cartDoc: AngularFirestoreDocument<Cart>;

  constructor(public afs: AngularFirestore, private auth: AngularFireAuth, private loading: LoadingController, private userAuth: AuthService, private orderService: OrderService ) {
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
  getCartNoChange(userUid) {
    return this.afs.collection('user-cart', ref => 
    ref.where('userUid', '==', userUid )
    .limit(1)).ref.get();
  }
  addCart(userUid, items: Item[]) {
    const cart = {
      userUid: userUid || this.userAuth.uid,
      items,
    }
    this.getCartNoChange(userUid)
    .then((c) => {
      console.log(c);
      if(c && !c.empty) {
        this.updateCart(userUid, items);
      }else {
        this.cartCollection.add(cart)
        .then((value) => {
          console.log('add hoi ha cart');
          return;
        }).catch((err) => {
          window.alert('You Dont have permission to Add Item');
          console.log(err);
          return;
        });
      }
    });
  }

  deleteCart(userUid: string) {
    const ref: AngularFirestoreDocument<any> = this.afs.doc(`user-cart/${userUid}`);
    return ref.delete().then(() => {
      console.log('deleted');
    });
  } 
  updateCart(userUid: string, items) {
    console.log(userUid, items);
    const loading = this.loading.create({
      content: 'Updating Cart',
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
  placeOrderByCart(item, providerId): Observable<any> {
    return Observable.create((obs:Subscriber<any>)=> {
      console.log('item aya', item);
      obs.next(this.orderService.putOrderEntryToProvider(item));
      obs.complete();
    }); 
  }
}
