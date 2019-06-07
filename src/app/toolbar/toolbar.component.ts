import { Component, EventEmitter, Input } from '@angular/core';
import { ChangeViewDialogComponent } from '../bill/dialogs/change-view-dialog/change-view-dialog.component';
import { MatBottomSheet } from '@angular/material';
import { FilterDialogComponent } from '../bill/dialogs/filter-dialog/filter-dialog.component';
import { WarrantyOptionsEnum } from '../_enums/warranty-option.enum';
import { BillService } from '../bill/bill.service';
import { Output } from '@angular/core';
import { FilterInterface } from '../_interfaces/filter.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() onViewByWarranty = new EventEmitter<void>();
  @Input() billsWarrantyInMonthLength: number;
  filter: FilterInterface;

  constructor(private billService: BillService, private bottomSheet: MatBottomSheet) {}

  changeView(): void {
    this.bottomSheet.open(ChangeViewDialogComponent);
  }

  changeViewByWarranty(): void {
    this.filter.selectedWarranty = WarrantyOptionsEnum.END_IN_ONE_MONTH;
    this.filter.selectedPrice = [];
    this.filter.selectedCategory = [];
    this.billService.filter.next(this.filter);
    this.onViewByWarranty.emit();
  }

  showFilterOption(): void {
    const bottomSheet = this.bottomSheet.open(FilterDialogComponent);
    bottomSheet.afterDismissed().subscribe();
  }
}
