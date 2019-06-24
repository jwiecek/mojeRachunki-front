import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { BillService } from './bill.service';
import { BillListComponent } from './bill-list/bill-list.component';
import { BillCreateComponent } from './bill-create/bill-create.component';
import { BillPhotoDialogComponent } from './dialogs/bill-photo-dialog/bill-photo-dialog.component';
import { ChangeViewDialogComponent } from './dialogs/change-view-dialog/change-view-dialog.component';
import { FilterDialogComponent } from './dialogs/filter-dialog/filter-dialog.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FilterBillComponent } from './filter-bill/filter-bill.component';
import { BillSearchComponent } from './bill-search/bill-search.component';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, MaterialModule, AuthRoutingModule],
  declarations: [
    BillListComponent,
    BillCreateComponent,
    BillSearchComponent,
    BillPhotoDialogComponent,
    FilterBillComponent,
    FilterDialogComponent,
    ChangeViewDialogComponent,
    ToolbarComponent
  ],
  providers: [BillService],
  entryComponents: [ChangeViewDialogComponent, FilterDialogComponent, BillPhotoDialogComponent]
})
export class BillModule {}
