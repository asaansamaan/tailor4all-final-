import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ItemListPage } from '../pages/item-list/item-list';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../providers/users/userAuth';
import { AboutPage } from '../pages/about/about';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { SplistPage } from '../pages/splist/splist';
import { CartPage } from '../pages/cart/cart';
import { User } from '../models/user';
import { OrderListPage } from '../pages/order-list/order-list';
 
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  pages: { title: string; component: any; }[];
  rootPage:any = ItemListPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    private authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.checkUserStatus().subscribe((user:User) => {
        if (!!user) {
          if(user.roles.provider) {
            this.pages = [
              { title: 'Profile', component: ProfilePage },
              { title: 'Shop', component: ItemListPage },
              { title: 'Orders', component: OrderListPage },
              { title: 'Cart', component: CartPage },        
              // { title: 'Our Tailors', component: SplistPage },        
              { title: 'About Us', component: AboutPage },
              { title: 'Contact Us', component: ContactUsPage },        
            ];
            return;
          }
          this.pages = [
            { title: 'Cart', component: CartPage },        
            { title: 'Our Tailors', component: SplistPage },        
            { title: 'About Us', component: AboutPage },
            { title: 'Contact Us', component: ContactUsPage },        
          ];
        } else {
          this.pages = [
            { title: 'Shop', component: ItemListPage },
            { title: 'Login', component: LoginPage },
            { title: 'Our Tailors', component: SplistPage },        
            { title: 'About Us', component: AboutPage },
            { title: 'Contact Us', component: ContactUsPage },        
          ];
        }  
      });
    });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  openMenu() {
    this.menuCtrl.open();
  }
  logout() {
    this.authService.signOut();
  }
  closeMenu() {
    this.menuCtrl.close();
  }
 
  toggleMenu() {
    this.menuCtrl.toggle();
  }
  checkUserStatus(): Observable<any> {
    return this.authService.user;
  }
}

