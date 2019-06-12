import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../_interfaces/tag.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.API_URL}/tags/userTags`);
  }
  getBasicTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.API_URL}/tags/basic`);
  }
  addTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(`${this.API_URL}/tags/create`, tag);
  }
  removeTag(id: string): Observable<Tag> {
    return this.http.delete<Tag>(`${this.API_URL}/tags/delete/${id}`);
  }
}
