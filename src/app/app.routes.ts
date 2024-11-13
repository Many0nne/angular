import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { InboxComponent } from './inbox/inbox.component';
import { ModifyComponent } from './modify/modify.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, 
    { path: 'home', component: HomeComponent, pathMatch: 'full' },
    { path: 'register', component: UserComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'account', component: AccountComponent, pathMatch: 'full' },
    { path: 'inbox', component: InboxComponent, pathMatch: 'full' },
    { path: 'modify', component: ModifyComponent, pathMatch: 'full' }
];

export class AppRoutingModule { }