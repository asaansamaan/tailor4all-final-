import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';
import { QuerySnapshot } from '@firebase/firestore-types';

@Injectable()
export class ItemService {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  constructor(public afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('title', 'asc'));
    this.items = this.itemsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }
  public categorizedItem(forCategory,limit, orderBy) {
    const femaleCollection = this.afs.collection('items', ref => 
    ref.where('for', '==', forCategory)
    .limit(limit)
    .orderBy(orderBy, 'asc'));
    return femaleCollection.snapshotChanges().map(changes => {
      return changes.map(a=>{
        return a.payload.doc.data() as Item;
      })
    })
  }
  getItems() {
    return this.items;
  }

  addItem(item: Item) {
    this.itemsCollection.add(item)
    .then((value) => {
      console.log(value);
    }).catch((err) => {
      window.alert('You Dont have permission to Add Item');
      console.log(err);
    });
  }

  deleteItem(item: Item) {
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.delete();
  }

  updateItem(item: Item) {
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.update(item);
  }
  searchItems(item: string, limit: number) {
    const collection = this.afs.collection<Item>('items', ref => ref
    .limit(limit)
    .orderBy('title')
    .startAt(item)
    .endAt(`${item}\uf8ff`));
    return collection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        return data;
      });
    });
  }
}
