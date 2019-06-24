import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillCreateComponent } from './bill-create/bill-create.component';
import { AuthGuard } from '../auth/auth.guard';

const billRouting: Routes = [
  { path: '', component: BillListComponent, canActivate: [AuthGuard], data: { title: 'Lista' } },
  { path: 'create', component: BillCreateComponent, canActivate: [AuthGuard], data: { title: 'Dodaj rachunek' } },
  {
    path: 'edit/:billId',
    component: BillCreateComponent,
    canActivate: [AuthGuard],
    data: { title: 'Edytuj rachunek' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(billRouting)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class BillRoutingModule {}
