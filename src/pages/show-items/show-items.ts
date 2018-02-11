import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ItemService } from '../../providers/items/itemService';
import { Item } from '../../models/item';
/**
 * Generated class for the ShowItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-items',
  templateUrl: 'show-items.html',
})
export class ShowItemsPage {
  items: Observable<Item[]>;
  femaleItems: any = [];
  category: string;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private http: Http,
     private itemService: ItemService, 
    ) {
  }
  
  ionViewDidLoad() {
    const category = this.navParams.get('category');
    this.category = category;
    if(category === 'men') {
      this.items = this.itemService.categorizedItem('male', 10, 'name')

    }
    if(category === 'women') {
     this.items = this.itemService.categorizedItem('female', 10, 'name')
    }
  }
  private getJSON(): Observable<any> {
    return this.http.get("assets/itemsCollection.json")
                    .map((res:any) => res.json())
  }
}
