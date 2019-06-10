import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BillService } from '../bill.service';
import { TagService } from '../../tag/tag.service';
import { Bill } from '../bill.model';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { WarrantyOptionsEnum } from '../../_enums/warranty-option.enum';
import { Tag } from '../../tag/tag.model';
import { BillPhotoDialogComponent } from '../dialogs/bill-photo-dialog/bill-photo-dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FilterInterface } from '../../_interfaces/filter.interface';

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
  public searchOptions = [];
  public searchForm: FormGroup;
  @ViewChild('searchRef') searchRef: ElementRef;
  private search: string;
  public elementsView;
  public filter: FilterInterface;
  public billsWarrantyInMonth = 0;
  public selectedCategory: Array<string> = [];
  private subscriptions: Subscription = new Subscription();
  public searchIsClicked = false;
  public removable = true;
  private today;
  private todayPlusOneMonth;
  private todayPlusOneYear;
  value;
  public innerWidth: any;
  isMobile: boolean;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private searchIdList = [];

  constructor(
    private billService: BillService,
    private tagService: TagService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.onResize();

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

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
    this.subscriptions.add(this.billService.elementsView.subscribe(elements => (this.elementsView = elements)));

    this.subscriptions.add(
      this.billService.currentFilter.subscribe((filter: FilterInterface) => {
        this.filter = filter;
        this.getByFilter();
      })
    );

    this.today = moment();
    this.todayPlusOneMonth = moment(this.today).add(1, 'months');
    this.todayPlusOneYear = moment(this.today).add(1, 'year');
    this.cleanSelected();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isMobile = this.innerWidth < 600;
  }

  getBills(): void {
    this.billService.getBills().subscribe(
      (bills: Bill[]) => {
        this.bills = bills;
        this.billsLength = this.bills.length;
        this.billsCopy = [...this.bills];
        this.bills.map((bill: Bill) => {
          bill.warrantyEndDate = new Date(bill.warrantyEndDate).toLocaleString('en-US');
          bill.expand = false;
        });
        this.bills.sort((a, b) => +new Date(b.purchaseDate) - +new Date(a.purchaseDate));
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
    this.tagService.getTags().subscribe((userTags: Tag[]) => {
      if (!userTags.length) {
        this.tagService.getBasicTags().subscribe((tags: Tag[]) => {
          this.tags = tags;
          this.tags.forEach((t: Tag) => {
            const newTag = {
              label: t.label,
              type: t.type,
              belongToLabel: t.belongToLabel,
              createdById: this.authService.userId
            };
            this.tagService.addTag(newTag).subscribe(e => console.log(e));
          });
        });
      } else {
        this.tags = userTags;
      }
    });
  }

  showSearchOption(text: string): void {
    if (text.length > 1) {
      this.search = text;
      this.billService.filterBill(this.search).subscribe(
        res => {
          this.searchOptions = res;
          console.log(res);
        },
        error => console.warn('err: ' + error)
      );
    } else {
      this.clearSearchInput();
    }
  }

  cleanSelected(): void {
    this.filter.selectedWarranty = null;
    this.filter.selectedPrice = [];
    this.filter.selectedCategory = [];
    this.billService.filter.next(this.filter);
  }

  getByFilter(): void {
    this.searchIdList = [];
    if (this.searchOptions) {
      this.searchIdList = this.searchOptions.reduce((arr, option) => option.idList, []);
    }
    this.getBillsByWarranty();
    const filterObject = {
      selectedCategory: this.filter.selectedCategory,
      selectedPrice: this.filter.selectedPrice,
      purchaseDateFrom: this.filter.purchaseDateFrom,
      purchaseDateTo: this.filter.purchaseDateTo,
      warrantyDateFrom: this.filter.warrantyFrom,
      warrantyDateTo: this.filter.warrantyTo,
      searchIdList: this.searchIdList
    };

    this.billService.filterAll(filterObject).subscribe(res => {
      this.bills = res;
    });
    this.filter.resultCount = this.bills.length;
  }

  getBillsByWarranty(): void {
    if (this.filter.selectedWarranty === WarrantyOptionsEnum.OVERDUE) {
      this.filter.warrantyTo = this.today;
    }
    if (this.filter.selectedWarranty === WarrantyOptionsEnum.END_IN_ONE_MONTH) {
      this.filter.warrantyFrom = this.today;
      this.filter.warrantyTo = this.todayPlusOneMonth;
    }
    if (this.filter.selectedWarranty === WarrantyOptionsEnum.END_IN_ONE_YEAR) {
      this.filter.warrantyFrom = this.today;
      this.filter.warrantyTo = this.todayPlusOneYear;
    }
    if (this.filter.selectedWarranty === WarrantyOptionsEnum.RANGE) {
      this.filter.warrantyFrom = moment(this.filter.warrantyFrom);
      this.filter.warrantyTo = moment(this.filter.warrantyTo);
    }
  }

  removeFilter(tag: string, type: string): void {
    if (type === 'category') {
      const index = this.filter.selectedCategory.indexOf(tag);
      if (index >= 0) {
        this.filter.selectedCategory.splice(index, 1);
        this.billService.filter.next(this.filter);
        this.getByFilter();
      }
    }
    if (type === 'price') {
      const index = this.filter.selectedPrice.indexOf(tag);
      if (index >= 0) {
        this.filter.selectedPrice.splice(index, 1);
        this.billService.filter.next(this.filter);

        this.getByFilter();
      }
    }
    if (type === 'warranty') {
      this.filter.selectedWarranty = null;
      this.billService.filter.next(this.filter);
      this.getByFilter();
    }
  }

  clearSearchInput(): void {
    this.searchOptions = [];
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
    this.billService.removeBill(id).subscribe(
      () => {
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
    this.router.navigate(['./edit/', bill._id]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
