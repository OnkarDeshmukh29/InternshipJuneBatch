import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './common/default-layout/default-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'accounts', 
    loadChildren: () => import('./pages/accounts/accounts.module').then(m => m.AccountsModule) 
  },
  
  {
    path: '',
    component: DefaultLayoutComponent,
    // canActivate: [AuthGuard], // Protect the entire layout and all its children
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full',  }, // Redirect to home if authenticated
      { 
        path: 'home', 
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) ,
        // canActivate: [AuthGuard]
      },
      { 
        path: 'contact-us', 
        loadChildren: () => import('./pages/contact-us/contact-us.module').then(m => m.ContactUsModule) 
      },
      { 
        path: 'user', 
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
        // canActivate: [AuthGuard] 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
