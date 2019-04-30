import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillCreateComponent } from './bill/bill-create/bill-create.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import { TagComponent } from './tag/tag/tag.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  { path: '', component: BillListComponent },
  { path: 'create', component: BillCreateComponent },
  { path: 'edit/:billId', component: BillCreateComponent },
  { path: 'tags', component: TagComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
