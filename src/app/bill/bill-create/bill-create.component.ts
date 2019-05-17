import { Component, OnInit, ViewChild } from '@angular/core';
import { Bill } from '../bill.model';
import { BillService } from '../bill.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../../tag/tag.model';
import { TagService } from '../../tag/tag.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSliderChange } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
const UploadURL = 'http://localhost:3000/api/upload';

@Component({
  selector: 'app-bill-create',
  templateUrl: './bill-create.component.html',
  styleUrls: ['./bill-create.component.scss']
})
export class BillCreateComponent implements OnInit {
  bill: Bill[] = [];
  tags: Tag[] = [];
  tagsPurchaseType: Tag[];
  tagsProduct: Tag[];
  tagsBrand: Tag[];
  tagsShop: Tag[];
  tagsPrice: Tag[];
  tagsWarranty: Tag[];
  imagePreview: string;
  billForm: FormGroup;
  visible = true;
  thumbLabel = true;
  selectable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedPurchaseTypes = [];
  selectedProducts = [];
  selectedShops = [];
  selectedBrands = [];
  selectedPrice = [];
  selectedWarrantyValue = 0;
  selectedWarrantyMonth: number;
  counter: number;
  mobile: boolean;
  progress = 10;
  maxDate = new Date();
  canNext = [true, false, true, false, false, false, true, true, true];
  ended = false;
  alert = '';
  time = 'miesięcy';
  selectedWarrantyLabel: any = 0;
  fileToUpload: File = null;
  imagePath;
  mode;
  billId: string;
  // yearUnit = 'lat';
  headerName: string;

  constructor(
    private http: HttpClient,
    private tagService: TagService,
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.counter = 0;
    if (window.screen.width === 360) {
      // 768px portrait
      this.mobile = true;
    }
    this.getTags();

    this.route.params.subscribe(params => {
      if (params.billId) {
        this.mode = 'edit';
        this.headerName = 'Edycja';
        this.billId = params.billId;
        this.getSelectedBill(this.billId);
      } else {
        this.mode = 'create';
        this.headerName = 'Dodawanie';
      }
    });
    this.billForm = new FormGroup({
      imageBillPath: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      purchaseDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        validators: [Validators.required]
      }),
      warranty: new FormControl(null, {
        validators: [Validators.required]
      }),
      purchaseType: new FormControl(null, {
        validators: [Validators.required]
      }),
      product: new FormControl(null, {
        validators: [Validators.required]
      }),
      brand: new FormControl(null),
      shop: new FormControl(null),
      description: new FormControl(null)
    });
  }

  getSelectedBill(id): void {
    this.billService.getBillById(id).subscribe((bill: Bill) => {
      this.selectedPurchaseTypes = [bill.purchaseType];
      this.selectedPrice = [bill.price];
      this.selectedProducts = [...bill.product];
      this.selectedBrands = [bill.brand];
      this.selectedShops = [bill.shop];

      const allSelectedTags = [
        ...this.selectedPurchaseTypes,
        ...this.selectedPrice,
        ...this.selectedProducts,
        ...this.selectedBrands,
        ...this.selectedShops
      ];
      allSelectedTags.forEach(tag => {
        this.tags.forEach(t => {
          if (tag === t.label) {
            t.selected = !t.selected;
          }
        });
      });

      this.billForm.setValue({
        imageBillPath: bill.imageBillPath,
        purchaseDate: bill.purchaseDate,
        purchaseType: this.selectedPurchaseTypes,
        product: this.selectedProducts,
        brand: this.selectedBrands,
        shop: this.selectedShops,
        price: this.selectedPrice,
        warranty: bill.warranty,
        description: bill.description
      });

      this.selectedWarrantyValue = bill.warranty;
      this.changeWarrantyValue();

      this.tagsBrand = this.tags.filter(
        t => t.type === 'brand' && t.belongToLabel.some(label => this.selectedPurchaseTypes.some(l => l === label))
      );
      this.tagsProduct = this.tags.filter(
        t => t.type === 'product' && t.belongToLabel.some(label => this.selectedPurchaseTypes.some(l => l === label))
      );
      this.tagsShop = this.tags.filter(
        t => t.type === 'shop' && t.belongToLabel.some(label => this.selectedPurchaseTypes.some(l => l === label))
      );
    });
  }
  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   // this.billForm.patchValue({ imageBillPath: file }); // patchValue == single; setValue === all
  //   // this.billForm.get('imageBillPath').updateValueAndValidity();
  //   // const reader = new FileReader();
  //   // reader.onload = () => {
  //   //   // @ts-ignore
  //   //   this.imagePreview = reader.result;
  //   // };
  //   // reader.readAsDataURL(file);
  //   // console.log(file);
  //   // console.log(reader);
  //   this.billService.upload(file).subscribe(res => console.log(res));
  // }

  onImagePicked(files: FileList): void {
    this.fileToUpload = files.item(0);
    // this.fileToUpload.name = 'aparat';
    this.billService.uploadPhoto(this.fileToUpload).subscribe(
      data => {
        this.imagePath = data[0].filename;
        console.log('dodano zdjecie: ' + data[0].filename);
      },
      error => {
        console.warn('err: ' + error);
      }
    );
  }

  getWarrantyValue(event: MatSliderChange): void {
    this.selectedWarrantyValue = event.value;
    this.changeWarrantyValue();
  }

  changeWarrantyValue(): void {
    if (this.selectedWarrantyValue <= 24) {
      this.selectedWarrantyLabel = this.selectedWarrantyValue;
      this.selectedWarrantyMonth = this.selectedWarrantyLabel;

      document.getElementsByClassName(
        'mat-slider-thumb-label-text'
      )[0].innerHTML = this.selectedWarrantyLabel.toString();

      this.time = 'miesięcy';
      if (this.selectedWarrantyValue === 1) {
        this.time = 'miesiąc';
      }
      if (this.selectedWarrantyValue > 1 && this.selectedWarrantyValue <= 4) {
        this.time = 'miesiące';
      }
      if (this.selectedWarrantyValue >= 5) {
        this.time = 'miesięcy';
      }
    } else {
      this.time = 'lat';
      this.selectedWarrantyLabel = this.selectedWarrantyValue - 22;
      this.selectedWarrantyMonth = this.selectedWarrantyLabel * 12;

      document.getElementsByClassName(
        'mat-slider-thumb-label-text'
      )[0].innerHTML = this.selectedWarrantyLabel.toString();
      if (
        (this.selectedWarrantyValue >= 24 && this.selectedWarrantyValue < 27) ||
        (this.selectedWarrantyValue >= 44 && this.selectedWarrantyValue < 47)
      ) {
        this.time = 'lata';
      }
      if (this.selectedWarrantyValue >= 54) {
        this.selectedWarrantyLabel = 'dożywotnio';
        this.time = '';
        document.getElementsByClassName('mat-slider-thumb-label-text')[0].innerHTML = '*';
      }
    }
  }

  getTags(): void {
    this.tagService.getTags().subscribe((tags: Tag[]) => {
      this.tags = tags;
      this.tags.forEach(t => (t.selected = false));
      this.getTagsByType();
    });
  }

  selectTag(tag: Tag, multiple: boolean): void {
    this.tags
      .filter(t => t.type === tag.type)
      .forEach(t => {
        if (!multiple) {
          tag.label === t.label ? (t.selected = true) : (t.selected = false);
        } else {
          if (tag.label === t.label) {
            t.selected = !t.selected;
          }
        }
      });
    this.filterSelectedTags();
    this.getTagsByType();
    this.setFormValue();
    this.checkPagination();
  }

  filterSelectedTags() {
    this.selectedPurchaseTypes = this.tagsPurchaseType.filter(t => t.selected === true).map(t => t.label);
    this.selectedPrice = this.tagsPrice.filter(t => t.selected === true).map(t => t.label);
    this.selectedProducts = this.tagsProduct.filter(t => t.selected === true).map(t => t.label);
    this.selectedBrands = this.tagsBrand.filter(t => t.selected === true).map(t => t.label);
    this.selectedShops = this.tagsShop.filter(t => t.selected === true).map(t => t.label);
  }

  getTagsByType(): void {
    this.tagsPurchaseType = this.tags.filter(tag => tag.type === 'purchaseType');
    this.tagsPrice = this.tags.filter(tag => tag.type === 'price');
    this.tagsWarranty = this.tags.filter(tag => tag.type === 'warranty');

    if (this.selectedPurchaseTypes) {
      this.tagsBrand = this.tags.filter(
        t => t.type === 'brand' && t.belongToLabel.some(label => this.selectedPurchaseTypes.some(l => l === label))
      );
      this.tagsProduct = this.tags.filter(
        t => t.type === 'product' && t.belongToLabel.some(label => this.selectedPurchaseTypes.some(l => l === label))
      );
      this.tagsShop = this.tags.filter(
        t => t.type === 'shop' && t.belongToLabel.some(label => this.selectedPurchaseTypes.some(l => l === label))
      );
    }
  }

  setFormValue() {
    this.billForm.setValue({
      imageBillPath: this.imagePath,
      purchaseDate: this.billForm.get('purchaseDate').value,
      purchaseType: this.selectedPurchaseTypes,
      product: this.selectedProducts,
      brand: this.selectedBrands,
      shop: this.selectedShops,
      price: this.selectedPrice,
      warranty: this.selectedWarrantyValue,
      description: this.billForm.get('description').value
    });
  }

  checkPagination() {
    this.canNext[this.counter] = true;

    if (this.ended && this.billForm.invalid) {
      this.canNext[this.counter] = false;
      this.alert = 'zaznacz coś!';
    } else {
      this.alert = '';
    }
  }

  addTag(event: MatChipInputEvent, tagType: string, multiple: boolean): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const newTag: Tag = {
        label: value.trim(),
        type: tagType,
        belongToLabel: this.selectedPurchaseTypes[0]
      };
      this.tagService.addTag(newTag).subscribe((tag: Tag) => {
        this.tags.push(tag);
        this.getTagsByType();
        this.selectTag(tag, multiple);
      });
    }
    if (input) {
      input.value = '';
    }
  }

  next(): void {
    this.counter++;
    this.progress = this.progress + 10;
    if (this.counter === 8) {
      this.ended = true;
    }
  }

  previous(): void {
    this.counter--;
    this.progress = this.progress - 10;
    this.alert = '';
  }

  onSaveBill(): void {
    if (this.billForm.invalid) {
      return;
    }
    const newBill = this.billForm.value;
    newBill.warranty = this.selectedWarrantyMonth;
    newBill.imageProductPath =
      'https://vignette.wikia.nocookie.net/nonsensopedia/images/c/c0/Paragon_czyt.png/revision/latest?cb=20100531220310';
    if (this.mode === 'edit') {
      newBill.updatedAt = new Date();
      this.billService.updateBill(newBill, this.billId).subscribe(bill => {
        console.log(bill);
        this.router.navigate(['/']);
      });
    } else {
      newBill.createdAt = new Date();
      newBill.updatedAt = '';
      this.billService.createBill(newBill).subscribe((bill: Bill) => {
        console.log(bill);
        this.router.navigate(['/']);
      });
    }
  }

  // test(value: number | null) {
  //   return `${value} ${this.yearUnit}`;
  // }
}
