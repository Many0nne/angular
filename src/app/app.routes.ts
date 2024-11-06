import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { InboxComponent } from './inbox/inbox.component';
import { ModifyComponent } from './modify/modify.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register', component: UserComponent },
    { path: 'login', component: LoginComponent },
    { path: 'account', component: AccountComponent },
    { path: 'inbox', component: InboxComponent },
    { path: 'modify', component: ModifyComponent }
];

export class AppRoutingModule { }