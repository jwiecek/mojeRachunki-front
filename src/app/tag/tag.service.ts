import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tag } from "./tag.model";

@Injectable({
  providedIn: "root"
})
export class TagService {
  API_URL = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  getTags() {
    return this.http.get(`${this.API_URL}/tags/userTags`);
  }
  getBasicTags() {
    return this.http.get(`${this.API_URL}/tags/basic`);
  }
  addTag(tag: Tag) {
    return this.http.post(`${this.API_URL}/tags/create`, tag);
  }
  removeTag(id: string) {
    return this.http.delete(`${this.API_URL}/tags/delete/${id}`);
  }
}
