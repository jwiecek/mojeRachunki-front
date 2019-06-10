import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { TagService } from '../../../tag/tag.service';
import { Tag } from '../../../tag/tag.model';
import { BillService } from '../../bill.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { WarrantyOptionsEnum } from '../../../_enums/warranty-option.enum';
import * as moment from 'moment';
import { FilterInterface } from '../../../_interfaces/filter.interface';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit, OnDestroy {
  private categoryList: Tag[];
  private priceList: Tag[];
  private subscriptions: Subscription = new Subscription();
  private dateForm: FormGroup;
  private warrantyForm: FormGroup;
  private warrantyOptions = [];
  public isMobile;
  public filter: FilterInterface;

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
      this.billService.currentFilter.subscribe((filter: FilterInterface) => {
        this.filter = filter;
        this.getList();
        if (filter.selectedWarranty === WarrantyOptionsEnum.NONE) {
          this.filter.warrantyFrom = moment(this.warrantyForm.get('fromWarranty').value);
          this.filter.warrantyTo = moment(this.warrantyForm.get('toWarranty').value);
        } else {
          this.filter.warrantyTo = null;
          this.filter.warrantyFrom = null;
        }
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

  getList(): void {
    this.tagService.getTags().subscribe((tags: Tag[]) => {
      this.categoryList = tags.filter((tag: Tag) => tag.type === 'purchaseType');
      this.priceList = tags.filter((tag: Tag) => tag.type === 'price');
      this.categoryList.map(tag => {
        this.filter.selectedCategory.some(label => label === tag.label)
          ? (tag.selected = true)
          : (tag.selected = false);
      });
      this.priceList.map(tag => {
        this.filter.selectedPrice.some(label => label === tag.label) ? (tag.selected = true) : (tag.selected = false);
      });
    });
  }

  setCategory(): void {
    this.filter.selectedCategory = this.categoryList
      .filter(label => label.selected === true)
      .map(category => category.label);
    this.billService.filter.next(this.filter);
  }

  setPrice(): void {
    this.filter.selectedPrice = this.priceList.filter(label => label.selected === true).map(price => price.label);
    this.billService.filter.next(this.filter);
  }

  setWarrantyOption(option: string): void {
    if (option !== WarrantyOptionsEnum.RANGE) {
      this.filter.warrantyFrom = null;
      this.filter.warrantyTo = null;
    }
    this.filter.selectedWarranty = option;
    this.billService.filter.next(this.filter);
  }

  setWarrantyRange(date, type) {
    if (type === 'from') {
      this.filter.warrantyFrom = date;
    } else if (type === 'to') {
      console.log(date);

      this.filter.warrantyTo = date;
    }
    this.billService.filter.next(this.filter);
  }

  cancel(): void {
    // this.selectedWarranty = null;
    // this.billService.selectedWarranty.next(this.selectedWarranty);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
