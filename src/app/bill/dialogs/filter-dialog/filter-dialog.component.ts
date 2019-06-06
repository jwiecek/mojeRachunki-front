import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TagService } from '../../../tag/tag.service';
import { Tag } from '../../../tag/tag.model';
import { BillService } from '../../bill.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { WarrantyOptionsEnum } from '../../../_enums/warranty-option.enum';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit, OnDestroy {
  private categoryList: Tag[];
  private priceList: Tag[];
  private selectedCategory: Array<string> = [];
  private selectedPrice: Array<string> = [];
  private subscriptions: Subscription = new Subscription();
  private dateForm: FormGroup;
  private warrantyForm: FormGroup;
  private warrantyOptions = [];
  private selectedWarranty = '';
  public resultCount = 0;
  isMobile;
  warrantyToDate;
  warrantyFromDate;

  constructor(
    private billService: BillService,
    private tagService: TagService,
    private bottomSheetRef: MatBottomSheetRef<FilterDialogComponent>
  ) {}

  ngOnInit() {
    this.onResize();
    this.dateForm = new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    });
    this.warrantyForm = new FormGroup({
      fromWarranty: new FormControl(),
      toWarranty: new FormControl()
    });

    this.warrantyOptions = Object.values(WarrantyOptionsEnum);
    this.subscriptions.add(
      this.billService.selectedCategory.subscribe((category: Array<string>) => {
        this.selectedCategory = category;
        this.getList();
      })
    );
    this.subscriptions.add(
      this.billService.selectedPrice.subscribe((price: Array<string>) => {
        this.selectedPrice = price;
        this.getList();
      })
    );
    this.subscriptions.add(
      this.billService.warrantyFrom.subscribe(from => {
        this.warrantyFromDate = from;
        this.getList();
      })
    );
    this.subscriptions.add(
      this.billService.warrantyFrom.subscribe(to => {
        this.warrantyToDate = to;
        this.getList();
      })
    );
    this.subscriptions.add(
      this.billService.selectedWarranty.subscribe((warranty: string) => {
        this.selectedWarranty = warranty;
        this.getList();
        if (warranty === WarrantyOptionsEnum.RANGE) {
          this.warrantyFromDate = this.warrantyForm.get('fromWarranty');
          this.warrantyToDate = this.warrantyForm.get('toWarranty');
        } else {
          this.warrantyFromDate = null;
          this.warrantyToDate = null;
        }
      })
    );
    this.subscriptions.add(
      this.billService.resultCount.subscribe(
        (count: number) => (this.resultCount = count)
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

  getList(): void {
    this.tagService.getTags().subscribe((tags: Tag[]) => {
      this.categoryList = tags.filter(
        (tag: Tag) => tag.type === 'purchaseType'
      );
      this.priceList = tags.filter((tag: Tag) => tag.type === 'price');
      this.categoryList.map(tag => {
        this.selectedCategory.some(label => label === tag.label)
          ? (tag.selected = true)
          : (tag.selected = false);
      });
      this.priceList.map(tag => {
        this.selectedPrice.some(label => label === tag.label)
          ? (tag.selected = true)
          : (tag.selected = false);
      });
    });
  }

  setCategory(): void {
    this.selectedCategory = this.categoryList
      .filter(label => label.selected === true)
      .map(category => category.label);
    this.billService.selectedCategory.next(this.selectedCategory);
  }

  setPrice(): void {
    this.selectedPrice = this.priceList
      .filter(label => label.selected === true)
      .map(price => price.label);
    this.billService.selectedPrice.next(this.selectedPrice);
  }

  setWarrantyOption(option: string): void {
    if (option === WarrantyOptionsEnum.RANGE) {
      console.log('zakres');
    }
    this.billService.selectedWarranty.next(option);
  }
  setWarrantyRange(date, type) {
    if (type === 'from') {
      this.warrantyFromDate = date;
      console.log(date);

      this.billService.warrantyFrom.next(this.warrantyFromDate);
    } else if (type === 'to') {
      console.log(date);

      this.warrantyToDate = date;
      this.billService.warrantyTo.next(this.warrantyToDate);
    }
    console.log('zmiana zakresu');
  }

  cancel(): void {
    this.selectedWarranty = null;
    this.billService.selectedWarranty.next(this.selectedWarranty);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
