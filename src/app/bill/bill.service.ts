import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bill } from './bill.model';
import { FilterInterface } from '../_interfaces/filter.interface';
import { WarrantyOptionsEnum } from '../_enums/warranty-option.enum';

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

  public filter = new BehaviorSubject<FilterInterface>({
    warrantyFrom: null,
    warrantyTo: null,
    selectedWarranty: WarrantyOptionsEnum.NONE,
    resultCount: 0,
    selectedCategory: [],
    selectedPriceFrom: null,
    selectedPriceTo: null,
    purchaseDateFrom: null,
    purchaseDateTo: null,
    searchIdList: []
  });
  public currentFilter = this.filter.asObservable();

  constructor(private http: HttpClient) {
    this.loggedUserId = BillService.getLoggedUserId();
  }

  static getLoggedUserId(): number {
    return JSON.parse(localStorage.getItem('currentUser')).userId;
  }
  getBills(): Observable<Bill[]> {
    // return this.http.get(`${this.API_URL}/bills/all`).pipe(tap(bill => new Bill(bill)));
    return this.http.get<Bill[]>(`${this.API_URL}/bills/allUserBills`);
  }

  createBill(bill: Bill): Observable<Bill> {
    const newBill = bill;
    newBill.createdById = this.loggedUserId;
    return this.http.post<Bill>(`${this.API_URL}/bills/create`, newBill);
  }

  updateBill(bill: Bill, id: string): Observable<Bill> {
    bill.updatedById = this.loggedUserId;
    return this.http.put<Bill>(`${this.API_URL}/bills/update?id=${id}`, bill);
  }

  getBillById(id: string): Observable<Bill> {
    return this.http.get<Bill>(`${this.API_URL}/bills/find/${id}`);
  }

  filterBill(search: string): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.API_URL}/bills/filter/${search}`);
  }

  filterAll(filterObject): Observable<Bill[]> {
    return this.http.post<Bill[]>(`${this.API_URL}/bills/filterAll`, filterObject);
  }

  removeBill(id: string): Observable<Bill> {
    return this.http.delete<Bill>(`${this.API_URL}/bills/delete/${id}`);
  }

  uploadPhoto(fileToUpload) {
    const formData: FormData = new FormData();
    formData.append('images', fileToUpload, fileToUpload.name);
    return this.http.post(`${this.API_URL}/bills/uploadPhoto`, formData);
  }
}
