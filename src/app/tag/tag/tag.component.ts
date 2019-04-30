import { Component, OnInit } from '@angular/core';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  tags: Tag[] = [];
  tagsPurchaseType: Tag[] = [];
  tagsPrice: Tag[] = [];
  tagsWarranty: Tag[] = [];
  tagsBrand: Tag[][] = [];
  tagsProduct: Tag[][] = [];
  tagsShop: Tag[][] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.getTags();
  }

  getTags(): void {
    this.tagService.getTags().subscribe((tag: Tag[]) => {
      this.tags = tag;
      this.getTagsByType();
    });
  }

  getTagsByType(): void {
    this.tagsPurchaseType = this.tags.filter((tag: Tag) => tag.type === 'purchaseType');
    this.tagsPrice = this.tags.filter((tag: Tag) => tag.type === 'price');
    this.tagsWarranty = this.tags.filter((tag: Tag) => tag.type === 'warranty');
    this.tagsPurchaseType.forEach((tag: Tag, index: number) => {
      const product = this.tags.filter(t => t.type === 'product' && t.belongToLabel.toString() === tag.label);
      this.tagsProduct[index] = product;
      const brand = this.tags.filter(t => t.type === 'brand' && t.belongToLabel.toString() === tag.label);
      this.tagsBrand[index] = brand;
      const shop = this.tags.filter(t => t.type === 'shop' && t.belongToLabel.toString() === tag.label);
      this.tagsShop[index] = shop;
    });
  }

  addTag(event: MatChipInputEvent, tagType: string, cType: string): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const newTag = {
        label: value.trim(),
        type: tagType,
        belongToLabel: [cType]
      };
      this.tagService.addTag(newTag).subscribe(
        (tag: Tag) => {
          this.tags.push(tag);
          this.getTags();
        },
        error => console.warn('err: ' + error)
      );
    }
    if (input) {
      input.value = '';
    }
  }
  removeTag(tag: Tag): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tagService.removeTag(tag._id).subscribe(
        res => {
          console.warn(res);
          this.tags.splice(index, 1);
          this.getTags();
        },
        err => console.error('HTTP Error', err)
      );
    }
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
