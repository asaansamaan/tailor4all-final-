import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsPage } from './contact-us';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContactUsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactUsPage),
    ReactiveFormsModule,
  ],
})
export class ContactUsPageModule {}
