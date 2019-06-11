import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillCreateComponent } from './bill/bill-create/bill-create.component';
import { BillListComponent } from './bill/bill-list/bill-list.component';
import { TagComponent } from './tag/tag/tag.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: BillListComponent, canActivate: [AuthGuard], data: { title: 'Lista' } },
  { path: 'create', component: BillCreateComponent, canActivate: [AuthGuard], data: { title: 'Dodaj rachunek' } },
  {
    path: 'edit/:billId',
    component: BillCreateComponent,
    canActivate: [AuthGuard],
    data: { title: 'Edytuj rachunek' }
  },
  { path: 'tags', component: TagComponent, canActivate: [AuthGuard], data: { title: 'Edycja tagów' } },
  { path: 'login', component: LoginComponent, data: { title: 'Logowanie' } },
  { path: 'register', component: RegisterComponent, data: { title: 'Rejestracja' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
