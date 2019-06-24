import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BillService } from '../../bill.service';
import { Subscription } from 'rxjs';
import { BillListComponent } from '../../bill-list/bill-list.component';
import { TagService } from '../../../tag/tag.service';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss'],
  providers: [BillListComponent]
})
export class FilterDialogComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public isMobile;
  public resultCount: number;

  constructor(
    private billService: BillService,
    private tagService: TagService,
    private bottomSheetRef: MatBottomSheetRef<FilterDialogComponent>
  ) {}

  ngOnInit() {
    this.onResize();
    this.subscriptions.add(
      this.billService.currentResultCount.subscribe(
        (resultCount: number) => {
          this.resultCount = resultCount;
        },
        error => console.log('error', error)
      )
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
