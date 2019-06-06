import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BillService } from '../../bill.service';
import { Subscription } from 'rxjs';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-change-view-dialog',
  templateUrl: './change-view-dialog.component.html',
  styleUrls: ['./change-view-dialog.component.scss']
})
export class ChangeViewDialogComponent implements OnInit, OnDestroy {
  public elementsView;
  private subscriptions: Subscription = new Subscription();
  isMobile;

  constructor(
    public billService: BillService,
    private bottomSheetRef: MatBottomSheetRef<ChangeViewDialogComponent>
  ) {}

  ngOnInit() {
    this.onResize();
    this.subscriptions.add(
      this.billService.elementsView.subscribe(
        elements => (this.elementsView = elements)
      )
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth < 660;
  }

  setElementView(): void {
    this.billService.elementsView.next(this.elementsView);
  }

  selectAll(): void {
    this.elementsView.price = true;
    this.elementsView.shop = true;
    this.elementsView.description = true;
    this.elementsView.warrantyEndDate = true;
    this.elementsView.purchaseType = true;
  }

  clearAll(): void {
    this.elementsView.price = false;
    this.elementsView.shop = false;
    this.elementsView.description = false;
    this.elementsView.warrantyEndDate = false;
    this.elementsView.purchaseType = false;
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
