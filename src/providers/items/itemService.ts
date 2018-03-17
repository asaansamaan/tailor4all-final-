import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';

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
  public categorizedItems(forCategory,limit, orderBy) {
    const collection = this.afs.collection('items', ref => 
    ref.where('for', '==', forCategory)
    .limit(limit)
    .orderBy(orderBy, 'asc'));
    return collection.snapshotChanges().map(changes => {
      return changes.map(a=>{
        return a.payload.doc.data() as Item;
      })
    })
  }
  getItems() {
    return this.items;
  }
  getItem(category, code) {
   const collection = this.afs.collection('items', ref => 
    ref.where('for', '==', category )
    .where('code', '==', code)
    .limit(1));
    return collection.snapshotChanges().map(changes => {
      return changes.map(a=>{
        return a.payload.doc.data() as Item;
      })
    })
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
