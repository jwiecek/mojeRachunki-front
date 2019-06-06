import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Bill } from './bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  API_URL = 'http://localhost:3000';
  loggedUserId;

  public elementsView = new BehaviorSubject<object>([
    { price: true },
    { purchaseType: false },
    { shop: false },
    { description: false },
    { warrantyEndDate: false }
  ]);
  // public filtersChanged = new BehaviorSubject<FilterInterface>({
  //   selectedCategory: [],
  //   selectedPrice: [],
  //   selectedWarrantyOption: WarrantyOptionsEnum.RANGE,
  //   selectedWarrantyFrom: null,
  //   selectedWarrantyTo: null,
  //   resultCount: null
  // });

  // public selectedWarranty = new BehaviorSubject<any>(null);

  public selectedWarranty = new BehaviorSubject<string>(null);
  public selectedCategory = new BehaviorSubject<Array<string>>([]);
  public selectedPrice = new BehaviorSubject<object>([]);
  public resultCount = new BehaviorSubject<number>(0);
  public warrantyFrom = new BehaviorSubject<any>(null);
  public warrantyTo = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.loggedUserId = BillService.getLoggedUserId();
  }

  static getLoggedUserId(): number {
    return JSON.parse(localStorage.getItem('currentUser')).userId;
  }
  getBills() {
    // return this.http.get(`${this.API_URL}/bills/all`).pipe(tap(bill => new Bill(bill)));
    return this.http.get(`${this.API_URL}/bills/allUserBills`);
  }

  createBill(bill: Bill) {
    const newBill = bill;
    newBill.createdById = this.loggedUserId;
    return this.http.post(`${this.API_URL}/bills/create`, newBill);
  }

  updateBill(bill: Bill, id: string) {
    bill.updatedById = this.loggedUserId;
    return this.http.put(`${this.API_URL}/bills/update?id=${id}`, bill);
  }

  getBillById(id: string) {
    return this.http.get(`${this.API_URL}/bills/find/${id}`);
  }

  filterBill(search: string) {
    return this.http.get(`${this.API_URL}/bills/filter/${search}`);
  }

  removeBill(id: string) {
    return this.http.delete(`${this.API_URL}/bills/delete/${id}`);
  }

  uploadPhoto(fileToUpload) {
    const formData: FormData = new FormData();
    formData.append('images', fileToUpload, fileToUpload.name);
    return this.http.post(`${this.API_URL}/bills/uploadPhoto`, formData);
  }

  // getPhoto(imgPath: string) {
  //   return this.http.get(`${this.API_URL}/bills/${imgPath}`);
  // }
}
