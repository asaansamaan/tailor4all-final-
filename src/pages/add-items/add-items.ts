import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../models/item';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';

/**
 * Generated class for the AddItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-items',
  templateUrl: 'add-items.html',
})
export class AddItemsPage {
  public items: Observable<Item[]>;
  public itemsCollection: AngularFirestoreCollection<Item>;
  public itemDoc: AngularFirestoreDocument<Item>;
  public newItem: Item;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection('items', ref => ref.orderBy('title', 'asc'));
    this.items = this.itemsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      });
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddItemsPage');
  }
  addItem() {
    console.log(this.newItem);
    this.itemsCollection.add(this.newItem)
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
