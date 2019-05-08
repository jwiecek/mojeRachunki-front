import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BillService } from '../bill.service';
import { TagService } from '../../tag/tag.service';
import { Bill } from '../bill.model';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
// import moment from 'moment/src/moment';
// import 'moment/src/locale/pl';
// @ts-ignore
import * as moment from 'moment';
// import 'moment/min/locales';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { WarrantyOptionsEnum } from '../../_enums/warranty-option.enum';
import { Tag } from '../../tag/tag.model';
import { BillPhotoDialogComponent } from '../dialogs/bill-photo-dialog/bill-photo-dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger('50ms', animate('550ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' })))
          ],
          { optional: true }
        ),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
})
export class BillListComponent implements OnInit, OnDestroy {
  public bills: Bill[] = [];
  public tags = [];
  public billsLength: number;
  private billsCopy: Bill[] = [];
  private searchOptions;
  private searchForm: FormGroup;
  @ViewChild('searchRef') searchRef: ElementRef;
  private search: string;
  public elementsView;
  public selectedWarranty = '';
  public billsWarrantyInMonth = 0;
  public selectedCategory: Array<string> = [];
  public selectedPrice: Array<string> = [];
  private subscriptions: Subscription = new Subscription();
  private searchIsClicked = false;
  public removable = true;
  private today;
  private todayPlusOneMonth;
  private todayPlusOneYear;
  private searchFilterBills = [];

  constructor(
    private billsService: BillService,
    private tagService: TagService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl()
    });
    this.getBills();
    this.getTags();
    fromEvent(this.searchRef.nativeElement, 'keyup')
      .pipe(
        map((evt: any) => evt.target.value),
        // filter(res => res.length > 1),
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((text: string) => this.showSearchOption(text), error => console.warn('err: ' + error));
    this.subscriptions.add(this.billsService.elementsView.subscribe(elements => (this.elementsView = elements)));
    this.subscriptions.add(
      this.billsService.selectedCategory.subscribe((category: Array<string>) => {
        this.selectedCategory = category;
        this.getByFilter();
      })
    );
    this.subscriptions.add(
      this.billsService.selectedWarranty.subscribe(
        (option: string) => (this.selectedWarranty = option),
        error => console.warn('err: ' + error)
      )
    );
    this.subscriptions.add(
      this.billsService.selectedPrice.subscribe((price: Array<string>) => (this.selectedPrice = price))
    );
    this.today = moment();
    this.todayPlusOneMonth = moment(this.today).add(1, 'months');
    this.todayPlusOneYear = moment(this.today).add(1, 'year');
    this.cleanSelected();
  }

  getBills(): void {
    this.billsService.getBills().subscribe(
      (bills: Bill[]) => {
        this.bills = bills;
        this.billsLength = this.bills.length;
        this.billsCopy = [...this.bills];
        this.bills.map((bill: Bill) => {
          const purchaseDate = new Date(bill.purchaseDate);
          bill.warrantyEndDate = new Date(
            purchaseDate.setMonth(purchaseDate.getMonth() + bill.warranty)
          ).toLocaleString('en-US');
          bill.expand = false;
        });
        this.bills.sort((a, b) => +new Date(b.purchaseDate) - +new Date(a.purchaseDate));
        this.searchFilterBills = [...this.bills];
        this.getBillsOneMonthWarranty();
      },
      error => console.warn('err: ' + error)
    );
  }

  checkIfWarrantyOneMonth(bill: Bill): boolean {
    return moment(bill.warrantyEndDate) > this.today && moment(bill.warrantyEndDate) < this.todayPlusOneMonth;
  }

  getBillsOneMonthWarranty() {
    this.billsWarrantyInMonth = this.billsCopy.filter(
      bill => moment(bill.warrantyEndDate) > this.today && moment(bill.warrantyEndDate) < this.todayPlusOneMonth
    ).length;
  }

  getTags(): void {
    this.tagService.getTags().subscribe((tags: Tag[]) => (this.tags = tags), error => console.warn('err: ' + error));
  }

  showSearchOption(text: string): void {
    if (text.length > 1) {
      this.search = text;
      this.billsService.filterBill(this.search).subscribe(
        res => {
          this.searchOptions = res;
        },
        error => console.warn('err: ' + error)
      );
    } else {
      this.searchOptions = [];
    }
  }

  cleanSelected(): void {
    this.billsService.selectedWarranty.next(null);
    this.billsService.selectedPrice.next([]);
    this.billsService.selectedCategory.next([]);
  }

  getByFilter(): void {
    if (this.selectedCategory.length > 0) {
      this.getBillsByCategory(this.searchFilterBills);
      if (this.selectedPrice.length > 0) {
        this.getBillsByPrice(this.bills);
      }
    } else {
      this.bills = this.searchFilterBills;
      if (this.selectedPrice.length > 0) {
        this.getBillsByPrice(this.searchFilterBills);
      }
    }
    this.getBillsByWarranty(this.bills);
    this.billsService.resultCount.next(this.bills.length);
  }

  getBillsByCategory(bills: Bill[]): void {
    this.bills = bills.filter((bill: Bill) =>
      this.selectedCategory.some(category => category === bill.purchaseType.toString())
    );
  }

  getBillsByPrice(bills: Bill[]): void {
    this.bills = bills.filter((bill: Bill) => this.selectedPrice.some(price => price === bill.price.toString()));
  }

  getBillsByWarranty(bills: Bill[] = this.billsCopy): void {
    if (this.selectedWarranty === WarrantyOptionsEnum.OVERDUE) {
      this.bills = bills
        .sort((a, b) => +new Date(b.warrantyEndDate) - +new Date(a.warrantyEndDate))
        .filter(b => moment(b.warrantyEndDate) < this.today);
    }
    if (this.selectedWarranty === WarrantyOptionsEnum.END_IN_ONE_MONTH) {
      this.bills = bills
        .sort((a, b) => +new Date(b.warrantyEndDate) - +new Date(a.warrantyEndDate))
        .filter(b => moment(b.warrantyEndDate) > this.today && moment(b.warrantyEndDate) < this.todayPlusOneMonth);
    }
    if (this.selectedWarranty === WarrantyOptionsEnum.END_IN_ONE_YEAR) {
      this.bills = bills
        .sort((a, b) => +new Date(b.warrantyEndDate) - +new Date(a.warrantyEndDate))
        .filter(b => moment(b.warrantyEndDate) > this.today && moment(b.warrantyEndDate) < this.todayPlusOneYear);
    }
  }

  removeFilter(tag: string, type: string): void {
    if (type === 'category') {
      const index = this.selectedCategory.indexOf(tag);
      if (index >= 0) {
        this.selectedCategory.splice(index, 1);
        this.getByFilter();
      }
    }
    if (type === 'price') {
      const index = this.selectedPrice.indexOf(tag);
      if (index >= 0) {
        this.selectedPrice.splice(index, 1);
        this.getByFilter();
      }
    }
    if (type === 'warranty') {
      this.selectedWarranty = null;
      this.billsService.selectedWarranty.next(null);
      this.getByFilter();
    }
  }

  getSelectedValue(): void {
    const idList = this.searchOptions.reduce((arr, option) => option.idList, []);
    this.searchFilterBills = this.billsCopy.filter(bill => idList.some(id => id === bill._id));
    this.getByFilter();
  }

  clearSearchInput(): void {
    this.searchOptions = [];
    this.searchFilterBills = [...this.billsCopy];
    this.getByFilter();
  }

  refresh(): void {
    this.cleanSelected();
    this.getBills();
  }

  expandPanel(bill: Bill): void {
    const index = this.bills.indexOf(bill);
    if (index >= 0) {
      this.bills[index].expand = !bill.expand;
    }
  }

  removeBill(id: string): void {
    this.billsService.removeBill(id).subscribe(
      res => {
        this.getBills();
      },
      error => console.warn('err: ' + error)
    );
  }

  showBillPhoto(url): void {
    this.dialog.open(BillPhotoDialogComponent, {
      width: '100vw',
      data: { urlPhoto: url }
    });
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  editBill(bill) {
    console.log(bill._id);
    this.router.navigate(['./edit/', bill._id]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
