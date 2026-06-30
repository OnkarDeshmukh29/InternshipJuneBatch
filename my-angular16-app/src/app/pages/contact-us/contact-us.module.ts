import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ContactUsComponent } from './contact-us.component';
import { ContactListComponent } from './contact-list/contact-list.component';

const routes: Routes = [
  { path: '', component: ContactUsComponent }
];

@NgModule({
  declarations: [
    ContactUsComponent,
    ContactListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ContactUsModule { }
