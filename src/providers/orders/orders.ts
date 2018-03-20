import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Cart } from '../../models/cart';
import { Item } from '../../models/item';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Order } from '../../models/order';

@Injectable()
export class OrderService {
    orders: Observable<Order[]>;
    ordersCollection: AngularFirestoreCollection<Order>;
    constructor(public afs: AngularFirestore) {
        this.ordersCollection = this.afs.collection('orders', ref => ref.orderBy('title', 'asc'));
        this.orders = this.ordersCollection.snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as Order;
            data.id = a.payload.doc.id;
            return data;
          });
        });
      }
    getOrder(userUid) {
        const collection = this.afs.collection('items', ref => 
        ref.where('item.userUid', '==', userUid ));
        return collection.snapshotChanges().map(changes => {
          return changes.map(a=>{
            return a.payload.doc.data() as Item;
          })
        })
    }
    putOrderEntryToProvider(item) {
        console.log('hogya push');
        this.ordersCollection.add({item})
        .then((value) => {
          console.log(value);
        }).catch((err) => {
          window.alert('You Dont have permission to Add Item');
          console.log(err);
        });
    }
}