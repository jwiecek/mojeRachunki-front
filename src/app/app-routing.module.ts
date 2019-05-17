import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillCreateComponent } from './bill/bill-create/bill-create.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import { TagComponent } from './tag/tag/tag.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: BillListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: BillCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:billId', component: BillCreateComponent, canActivate: [AuthGuard] },
  { path: 'tags', component: TagComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
