import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
 
import { MyApp } from './app.component';
 
import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { FirebaseProvider } from './../providers/firebase/firebase';
import { firebaseConfig } from './firebase.config';
import { HomePageModule } from '../pages/home/home.module';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { LoginPageModule } from '../pages/login/login.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { ItemListPageModule } from '../pages/item-list/item-list.module';
import { AuthService } from '../providers/users/userAuth';
import { AboutPageModule } from '../pages/about/about.module';
import { ContactUsPageModule } from '../pages/contact-us/contact-us.module';
import { SplistPageModule } from '../pages/splist/splist.module'; 
import { CartPageModule } from '../pages/cart/cart.module';
 
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HomePageModule,
    LoginPageModule,
    ProfilePageModule,
    ItemListPageModule,
    ContactUsPageModule,
    CartPageModule,
    SplistPageModule,
    AboutPageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FirebaseProvider,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}