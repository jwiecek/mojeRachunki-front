import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Bill } from './bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  API_URL = 'http://localhost:3000';

  public elementsView = new BehaviorSubject<object>([
    { price: true },
    { purchaseType: false },
    { shop: false },
    { description: false },
    { warrantyEndDate: false }
  ]);
  public filtersChanged$ = new BehaviorSubject<string>('');
  public selectedWarranty = new BehaviorSubject<string>('');
  public selectedCategory = new BehaviorSubject<object>([]);
  public selectedPrice = new BehaviorSubject<object>([]);
  public resultCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  getBills() {
    // return this.http.get(`${this.API_URL}/bills/all`).pipe(tap(bill => new Bill(bill)));
    return this.http.get(`${this.API_URL}/bills/all`);
  }

  addBill(bill: Bill) {
    return this.http.post(`${this.API_URL}/bills/create`, bill);
  }

  filterBill(search: string) {
    return this.http.get(`${this.API_URL}/bills/filter/${search}`);
  }

  removeBill(id: string) {
    return this.http.delete(`${this.API_URL}/bills/delete/${id}`);
  }

  uploadPhoto(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    return this.http.post(`${this.API_URL}/bills/uploadPhoto`, formData);
  }

  getPhoto(imgpath) {
    return this.http.get(`${this.API_URL}/bills/${imgpath}`);
  }
}
