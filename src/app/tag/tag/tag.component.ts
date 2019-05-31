import { Component, OnInit } from "@angular/core";
import { TagService } from "../tag.service";
import { Tag } from "../tag.model";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-tag",
  templateUrl: "./tag.component.html",
  styleUrls: ["./tag.component.scss"]
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

  constructor(
    private tagService: TagService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getTags();
  }

  getTags(): void {
    this.tagService.getTags().subscribe((userTags: Tag[]) => {
      console.log(userTags);
      this.tags = userTags;
      this.getTagsByType();
    });
  }

  getTagsByType(): void {
    this.tagsPurchaseType = this.tags.filter(
      (tag: Tag) => tag.type === "purchaseType"
    );
    this.tagsPrice = this.tags.filter((tag: Tag) => tag.type === "price");
    // this.tagsPrice = this.tagsPrice.sort((a, b) => parseFloat(a.label) - parseFloat(b.label));
    this.tagsPrice = this.tagsPrice.sort(
      (a, b) =>
        parseFloat(a.label.replace(/\D/g, "")) -
        parseFloat(b.label.replace(/\D/g, ""))
    );
    this.tagsWarranty = this.tags.filter((tag: Tag) => tag.type === "warranty");
    this.tagsPurchaseType.forEach((tag: Tag, index: number) => {
      this.tagsProduct[index] = this.tags.filter(
        t => t.type === "product" && t.belongToLabel.toString() === tag.label
      );
      this.tagsBrand[index] = this.tags.filter(
        t => t.type === "brand" && t.belongToLabel.toString() === tag.label
      );
      this.tagsShop[index] = this.tags.filter(
        t => t.type === "shop" && t.belongToLabel.toString() === tag.label
      );
    });
  }

  addTag(event: MatChipInputEvent, tagType: string, cType: string): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      const newTag = {
        label: value.trim(),
        type: tagType,
        belongToLabel: [cType],
        createdById: this.authService.userId
      };
      this.tagService.addTag(newTag).subscribe(
        (tag: Tag) => {
          this.tags.push(tag);
          this.getTags();
        },
        error => console.warn("err: " + error)
      );
    }
    if (input) {
      input.value = "";
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
        err => console.error("HTTP Error", err)
      );
    }
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
