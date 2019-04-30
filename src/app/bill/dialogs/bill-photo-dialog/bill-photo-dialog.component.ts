import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BillService } from '../../bill.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-bill-photo-dialog',
  templateUrl: './bill-photo-dialog.component.html',
  styleUrls: ['./bill-photo-dialog.component.scss']
})
export class BillPhotoDialogComponent implements OnInit {
  url: string;
  photo;
  public imagePath;
  imgURL: any;

  constructor(
    public dialogRef: MatDialogRef<BillPhotoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public billService: BillService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.url = this.data.urlPhoto;
    console.log(this.data);
    console.log(this.url);
    this.billService.getPhoto(this.url).subscribe(res => {
      console.log(res);
      const reader = new FileReader();
      // reader.onload = () => {};
      // reader.readAsArrayBuffer(res);
      //
      // this.imagePath = res;
      // reader.readAsDataURL(res);
      // reader.onload = () => {
      //   this.imgURL = reader.result;
      // };
      this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + res + '.jpg');
    });
  }
}
