import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BillService } from '../../bill/bill.service';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FilterInterface } from '../../_interfaces/filter.interface';

@Component({
  selector: 'app-bill-search',
  templateUrl: './bill-search.component.html',
  styleUrls: ['./bill-search.component.scss']
})
export class BillSearchComponent implements OnInit, OnDestroy {
  constructor(private billService: BillService) {}

  public value;
  public searchOptions = [];
  public searchForm: FormGroup;
  private search: string;
  private searchIdList;
  @Output() filterBills = new EventEmitter<void>();
  @ViewChild('searchRef') searchRef: ElementRef;
  private filter: FilterInterface;
  private subscriptions: Subscription = new Subscription();
  public isMobile: boolean;

  ngOnInit() {
    this.onResize();
    this.searchForm = new FormGroup({
      search: new FormControl()
    });
    fromEvent(this.searchRef.nativeElement, 'keyup')
      .pipe(
        map((evt: any) => evt.target.value),
        // filter(res => res.length > 1),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((text: string) => this.showSearchOption(text), error => console.warn('err: ' + error));

    this.subscriptions.add(
      this.billService.currentFilter.subscribe((filter: FilterInterface) => {
        setTimeout(() => {
          this.filter = filter;
        }, 1000);
      })
    );
  }

  showSearchOption(text: string): void {
    if (text.length > 1) {
      this.search = text;
      this.billService.filterBill(this.search).subscribe(
        res => {
          this.searchOptions = res;
        },
        error => console.warn('err: ' + error)
      );
    } else {
      this.clearSearchInput();
    }
  }

  clearSearchInput() {
    this.searchOptions = [];
    this.filter.searchIdList = [];
    this.billService.filter.next(this.filter);
    this.filterBills.emit();
  }

  getByFilter() {
    this.searchIdList = [];
    if (this.searchOptions) {
      this.searchIdList = this.searchOptions.reduce((arr, option) => option.idList, []);
      this.filter.searchIdList = this.searchIdList;
      this.billService.filter.next(this.filter);
    }
    this.filterBills.emit();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth < 600;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
