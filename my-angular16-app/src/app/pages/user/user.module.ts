import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';

const routes: Routes = [
  { path: '', component: UserComponent }
];

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
