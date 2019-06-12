import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Tag } from '../../_interfaces/tag.interface';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterInterface } from '../../_interfaces/filter.interface';
import { BillService } from '../../bill/bill.service';
import { TagService } from '../../tag/tag.service';
import { WarrantyOptionsEnum } from '../../_enums/warranty-option.enum';

@Component({
  selector: 'app-filter-bill',
  templateUrl: './filter-bill.component.html',
  styleUrls: ['./filter-bill.component.scss']
})
export class FilterBillComponent implements OnInit, OnDestroy {
  private categoryList: Tag[];
  private subscriptions: Subscription = new Subscription();
  private dateForm: FormGroup;
  private warrantyForm: FormGroup;
  private warrantyOptions = [];
  public isMobile;
  public filter: FilterInterface;
  @Output() onChangeCategory = new EventEmitter<void>();

  constructor(private billService: BillService, private tagService: TagService) {}

  ngOnInit() {
    this.onResize();
    this.dateForm = new FormGroup({
      fromDate: new FormControl(),
      toDate: new FormControl()
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
          this.filter.warrantyFrom = this.warrantyForm.get('fromWarranty').value;
          this.filter.warrantyTo = this.warrantyForm.get('toWarranty').value;
        } else {
          this.filter.warrantyTo = null;
          this.filter.warrantyFrom = null;
        }
      })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const innerWidth = window.innerWidth;
    this.isMobile = innerWidth < 660;
  }

  getList(): void {
    this.tagService.getTags().subscribe((tags: Tag[]) => {
      this.categoryList = tags.filter((tag: Tag) => tag.type === 'purchaseType');
      this.categoryList.map(tag => {
        this.filter.selectedCategory.some(label => label === tag.label)
          ? (tag.selected = true)
          : (tag.selected = false);
      });
    });
  }

  setCategory(): void {
    this.filter.selectedCategory = this.categoryList
      .filter(label => label.selected === true)
      .map(category => category.label);
    this.onChangeCategory.emit();
  }

  setPrice(): void {
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

  setRange(type) {
    if (type === 'fromWarranty') {
      this.filter.warrantyFrom = this.warrantyForm.get('fromWarranty').value;
    } else if (type === 'toWarranty') {
      this.filter.warrantyTo = this.warrantyForm.get('toWarranty').value;
    } else if (type === 'fromDate') {
      this.filter.purchaseDateFrom = this.dateForm.get('fromDate').value;
    } else if (type === 'toDate') {
      this.filter.purchaseDateTo = this.dateForm.get('toDate').value;
    }
    this.billService.filter.next(this.filter);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
