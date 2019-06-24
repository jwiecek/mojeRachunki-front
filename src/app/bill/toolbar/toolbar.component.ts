import { Component, EventEmitter, Input } from '@angular/core';
import { ChangeViewDialogComponent } from '../dialogs/change-view-dialog/change-view-dialog.component';
import { MatBottomSheet } from '@angular/material';
import { FilterDialogComponent } from '../dialogs/filter-dialog/filter-dialog.component';
import { WarrantyOptionsEnum } from '../../_enums/warranty-option.enum';
import { BillService } from '../bill.service';
import { Output } from '@angular/core';
import { FilterInterface } from '../interfaces/filter.interface';
import { BillListComponent } from '../bill-list/bill-list.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() onViewByWarranty = new EventEmitter<void>();
  @Input() billsWarrantyInMonthLength: number;
  public filter: FilterInterface;

  constructor(private billService: BillService, private bottomSheet: MatBottomSheet) {}

  changeView(): void {
    this.bottomSheet.open(ChangeViewDialogComponent);
  }

  changeViewByWarranty(): void {
    this.filter.selectedWarranty = WarrantyOptionsEnum.END_IN_ONE_MONTH;
    this.filter.selectedPriceFrom = null;
    this.filter.selectedPriceTo = null;
    this.filter.purchaseDateFrom = null;
    this.filter.purchaseDateTo = null;
    this.filter.categoryList = [];
    this.billService.filter.next(this.filter);
    this.onViewByWarranty.emit();
  }

  showFilterOption(): void {
    const bottomSheet = this.bottomSheet.open(FilterDialogComponent);
    bottomSheet.afterDismissed().subscribe(() => {
      // this.billComponent.getByFilter();
    });
  }
}
