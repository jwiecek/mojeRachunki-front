import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BillService } from '../bill.service';
import { TagService } from '../../tag/tag.service';
import { Bill } from '../bill.model';
import { Subscription } from 'rxjs';
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
  public elementsView;
  public filter: FilterInterface;
  public billsWarrantyInMonth = 0;
  public selectedCategory: Array<string> = [];
  private subscriptions: Subscription = new Subscription();
  public removable = true;
  private today;
  private todayPlusOneMonth;
  private todayPlusOneYear;
  public value;
  public innerWidth: any;
  public isMobile: boolean;
  public userIsAuthenticated = false;

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
    this.subscriptions.add(
      this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      })
    );
    this.getBills();
    this.getTags();
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

  getByFilter(): void {
    this.getBillsByWarranty();
    const filterObject = {
      selectedCategory: this.filter.selectedCategory,
      selectedPriceFrom: this.filter.selectedPriceFrom,
      selectedPriceTo: this.filter.selectedPriceTo,
      purchaseDateFrom: this.filter.purchaseDateFrom,
      purchaseDateTo: this.filter.purchaseDateTo,
      warrantyDateFrom: this.filter.warrantyFrom,
      warrantyDateTo: this.filter.warrantyTo,
      searchIdList: this.filter.searchIdList
    };

    this.billService.filterAll(filterObject).subscribe(res => {
      this.bills = res;
      this.bills.sort((a, b) => +new Date(b.purchaseDate) - +new Date(a.purchaseDate));
    });
    this.filter.resultCount = this.bills.length;
    // this.billService.filter.next(this.filter);
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
      }
    }
    if (type === 'price') {
      this.filter.selectedPriceFrom = null;
      this.filter.selectedPriceTo = null;
      this.billService.filter.next(this.filter);
    }
    if (type === 'purchaseDate') {
      this.filter.purchaseDateFrom = null;
      this.filter.purchaseDateTo = null;
      this.billService.filter.next(this.filter);
    }
    if (type === 'warranty') {
      this.filter.selectedWarranty = null;
      this.billService.filter.next(this.filter);
    }
    this.getByFilter();
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
    const dialogWidth = this.isMobile ? '100vw' : '350px';
    this.dialog.open(BillPhotoDialogComponent, {
      width: dialogWidth,
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
  }
}
