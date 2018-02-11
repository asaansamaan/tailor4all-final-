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
      this.checkUserStatus().subscribe(user => {
        if (!!user) {
          this.pages = [
            { title: 'Home', component: ItemListPage },
            { title: 'Profile', component: ProfilePage },
            { title: 'About Us', component: HomePage },
            { title: 'Contact Us', component: HomePage },        
          ];
        } else {
          this.pages = [
            { title: 'Home', component: ItemListPage },
            { title: 'Login', component: LoginPage },
            { title: 'About Us', component: LoginPage },
            { title: 'Contact Us', component: HomePage },        
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

