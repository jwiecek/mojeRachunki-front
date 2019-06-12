import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BillService } from '../../bill.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public isMobile;
  public resultCount: number;

  constructor(private billService: BillService, private bottomSheetRef: MatBottomSheetRef<FilterDialogComponent>) {}

  ngOnInit() {
    this.onResize();
    this.checkCount();
  }

  checkCount() {
    this.subscriptions.add(
      this.billService.currentResultCount.subscribe((resultCount: number) => {
        this.resultCount = resultCount;
      })
    );
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth < 660;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
