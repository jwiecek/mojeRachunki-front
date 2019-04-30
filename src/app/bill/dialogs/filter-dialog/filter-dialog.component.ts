import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
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
  private warrantyOptions = [];
  private selectedWarranty = '';
  public resultCount = 0;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<FilterDialogComponent>,
    private billService: BillService,
    private tagService: TagService
  ) {}

  ngOnInit() {
    this.dateForm = new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    });
    this.getList();
    this.warrantyOptions = Object.values(WarrantyOptionsEnum);
    this.subscriptions.add(
      this.billService.selectedCategory.subscribe((category: Array<string>) => (this.selectedCategory = category))
    );
    this.subscriptions.add(
      this.billService.selectedPrice.subscribe((price: Array<string>) => (this.selectedPrice = price))
    );
    this.subscriptions.add(
      this.billService.selectedWarranty.subscribe((warranty: string) => (this.selectedWarranty = warranty))
    );
    this.subscriptions.add(this.billService.resultCount.subscribe((count: number) => (this.resultCount = count)));
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  getList(): void {
    this.tagService.getTags().subscribe((tags: Tag[]) => {
      this.categoryList = tags.filter((tag: Tag) => tag.type === 'purchaseType');
      this.priceList = tags.filter((tag: Tag) => tag.type === 'price');
      this.categoryList.map(tag => {
        this.selectedCategory.some(label => label === tag.label) ? (tag.selected = true) : (tag.selected = false);
      });
      this.priceList.map(tag => {
        this.selectedPrice.some(label => label === tag.label) ? (tag.selected = true) : (tag.selected = false);
      });
    });
  }

  setCategory(): void {
    this.subscriptions.add(this.billService.resultCount.subscribe((count: number) => (this.resultCount = count)));
    this.selectedCategory = this.categoryList.filter(label => label.selected === true).map(category => category.label);
    this.billService.selectedCategory.next(this.selectedCategory);
  }

  setPrice(): void {
    this.subscriptions.add(this.billService.resultCount.subscribe((count: number) => (this.resultCount = count)));
    this.selectedPrice = this.priceList.filter(label => label.selected === true).map(price => price.label);
    this.billService.selectedPrice.next(this.selectedPrice);
  }

  setWarrantyOption(option: string): void {
    this.subscriptions.add(this.billService.resultCount.subscribe((count: number) => (this.resultCount = count)));
    this.billService.selectedWarranty.next(option);
  }

  cancel(): void {
    this.selectedWarranty = null;
    this.billService.selectedWarranty.next(this.selectedWarranty);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
