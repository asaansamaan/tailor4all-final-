import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
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
  category: string;
  items: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private http: Http) {
  }
  
  ionViewDidLoad() {
    const category = this.navParams.get('category');
    this.category = category;
    if(category === 'men') {
      this.getJSON().subscribe(data => {
        this.items = data.men
        console.log(data);
    });
    }
    if(category === 'women') {
      this.getJSON().subscribe(data => this.items = data.women);
    }
  }
  public getJSON(): Observable<any> {
    return this.http.get("assets/itemsCollection.json")
                    .map((res:any) => res.json())
  }
}
